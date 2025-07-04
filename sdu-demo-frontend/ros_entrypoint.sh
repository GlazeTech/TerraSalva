#!/bin/bash
set -e
source /opt/ros/jazzy/setup.bash
if [ -f "/root/ros2-glaze-package/install/setup.bash" ]; then
  source /root/ros2-glaze-package/install/setup.bash
fi
exec "$@"