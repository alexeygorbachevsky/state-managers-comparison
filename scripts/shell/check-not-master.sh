# #!/bin/bash

if [ "$(git rev-parse --abbrev-ref HEAD)" = "master" ]; then
    echo "\033[31mDon't commit/push to master"
    exit 1
fi

 exit 0