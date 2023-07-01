# #!/bin/bash

local_branch="$(git rev-parse --abbrev-ref HEAD)"
branch_name_length=`expr "$local_branch" : ".*"`
max_length=49

if [ "$branch_name_length" -gt "$max_length" ]; then
  echo "The branch name \"$local_branch\" exceeds the character limit!"
  echo "Current length = $branch_name_length, max length = $max_length"
  exit 1
fi

 exit 0