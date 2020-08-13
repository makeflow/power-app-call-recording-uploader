package com.phonecallrecorduploader;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;

// TODO (BUG): 有时 onOutgoingCallStarted 获得的 number 是上一次通话的
class PhoneCallReceiverBase extends BroadcastReceiver {

  // The receiver will be recreated whenever android feels like it.
  // We need a static variable to remember data between instantiations

  private static int lastState = TelephonyManager.CALL_STATE_IDLE;
  private static Date callStartTime;
  private static boolean isIncoming;
  private static String savedNumber; // because the passed incoming is only valid in ringing

  @Override
  public void onReceive(Context context, Intent intent) {
    Bundle extras = Objects.requireNonNull(intent.getExtras());

    // We listen to two intents. The new outgoing call only tells us of an outgoing call.
    // We use it to get the number.
    if ("android.intent.action.NEW_OUTGOING_CALL".equals(intent.getAction())) {
      savedNumber = extras.getString("android.intent.extra.PHONE_NUMBER");
    } else {
      String stateStr = extras.getString(TelephonyManager.EXTRA_STATE);
      String number = extras.getString(TelephonyManager.EXTRA_INCOMING_NUMBER);
      int state = 0;
      if (TelephonyManager.EXTRA_STATE_IDLE.equals(stateStr)) {
        state = TelephonyManager.CALL_STATE_IDLE;
      } else if (TelephonyManager.EXTRA_STATE_OFFHOOK.equals(stateStr)) {
        state = TelephonyManager.CALL_STATE_OFFHOOK;
      } else if (TelephonyManager.EXTRA_STATE_RINGING.equals(stateStr)) {
        state = TelephonyManager.CALL_STATE_RINGING;
      }
      onCallStateChanged(context, state, number);
    }
  }

  // Derived classes should override these to respond to specific events of interest

  protected void onIncomingCallStarted(Context ctx, String number, Date start) {
  }

  protected void onOutgoingCallStarted(Context ctx, String number, Date start) {
  }

  protected void onIncomingCallEnded(Context ctx, String number, Date start, Date end) {
  }

  protected void onOutgoingCallEnded(Context ctx, String number, Date start, Date end) {
  }

  protected void onMissedCall(Context ctx, String number, Date missed) {
  }

  // Deals with actual events

  // Incoming call - goes from IDLE to RINGING when it rings, to OFFHOOK when it's answered, to IDLE when its hung up
  // Outgoing call - goes from IDLE to OFFHOOK when it dials out, to IDLE when hung up
  public void onCallStateChanged(Context context, int state, String number) {
    if (lastState == state) {
      // No change, debounce extras
      return;
    }
    switch (state) {
      case TelephonyManager.CALL_STATE_RINGING:
        isIncoming = true;
        callStartTime = new Date();
        savedNumber = number;
        onIncomingCallStarted(context, number, callStartTime);
        break;
      case TelephonyManager.CALL_STATE_OFFHOOK:
        // Transition of ringing->offhook are pickups of incoming calls. Nothing done on them
        if (lastState != TelephonyManager.CALL_STATE_RINGING) {
          isIncoming = false;
          callStartTime = new Date();
          onOutgoingCallStarted(context, savedNumber, callStartTime);
        }
        break;
      case TelephonyManager.CALL_STATE_IDLE:
        // Went to idle - this is the end of a call.  What type depends on previous state(s)
        if (lastState == TelephonyManager.CALL_STATE_RINGING) {
          // Ring but no pickup - a miss
          onMissedCall(context, savedNumber, callStartTime);
        } else if (isIncoming) {
          onIncomingCallEnded(context, savedNumber, callStartTime, new Date());
        } else {
          onOutgoingCallEnded(context, savedNumber, callStartTime, new Date());
        }
        break;
    }
    lastState = state;
  }
}

public class PhoneCallReceiver extends PhoneCallReceiverBase {

  public static final int OUTGOING_CALL_STARTED = 0;
  public static final int OUTGOING_CALL_ENDED = 1;

  private List<PhoneCallListener> listeners = new ArrayList<>(8);

  @Override
  protected void onOutgoingCallStarted(Context ctx, String number, Date time) {
    listeners.forEach(listener -> listener.onChange(OUTGOING_CALL_STARTED, number, time));
  }

  @Override
  protected void onOutgoingCallEnded(Context ctx, String number, Date start, Date time) {
    listeners.forEach(listener -> listener.onChange(OUTGOING_CALL_ENDED, number, time));
  }

  public void addListener(PhoneCallListener listener) {
    this.listeners.add(listener);
  }
}
