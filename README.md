# Call-Recording-Uploader

上传通话录音功能的 PowerApp 套件

### Development Guide

#### Release

Command:

```
./release.sh <type> <version>
```

type:

- android
- power-app

Example:

```
./release.sh android 1.0
./release.sh power-app 0.0.1
```

The power-app will be built as a docker image at [Docker Hub](https://hub.docker.com/repository/docker/makeflow/power-app-call-recording-uploader). And the android apk can be found at GitHub release page.
