#!/bin/bash

# Helps migrate from an existing companion app setup to a fresh clone.
# Essentially replaces step 2 of the README (Configure Development Environment)
# Provided that the existing project is configured correctly.

# Usage

# ./bin/migrate-project.bash old_dir new_dir

old=$1
new=$2

if [[ -z "$old" ]]; then
	echo "must provide path to old project" && exit 1
fi

if [[ -z "$new" ]]; then
	new="."
fi

__check_confirm__() {
	if [[ ! $confirm =~ ^[Yy]$ ]]; then
		echo "exiting" && exit 0
	fi
} 

__fail__() {
	echo "migration failed. There may be leftover files" && exit 1 
}

read -r -p "Will copy files from $old - Continue? [Y/n] " confirm
__check_confirm__

cp "$old/mobile/configs/app/google-services.json" "$new/mobile/configs/app/google-services.json" || __fail__
cp "$old/mobile/configs/app/GoogleService-Info.plist" "$new/mobile/configs/app/GoogleService-Info.plist" || __fail__
cp "$new/mobile/configs/app/google-services.json" "$new/mobile/android/app" || __fail__
cp "$old/.env" "$new/.env" || __fail__
cp "$old/server/functions/.env" "$new/server/functions/.env" || __fail__

echo "done copying."

read -r -p "Run setup? [Y/n] " confirm
__check_confirm__

cd "$new" && bash bin/setup.bash
