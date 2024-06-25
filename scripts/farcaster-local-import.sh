#!/bin/bash

SCRIPT_DIR=$(dirname "$(realpath "$0")")
SEED_DIR=${SCRIPT_DIR}/../seed/farcaster

usage() {
  echo "Usage: $0 <starting-timestamp> (--no_truncate)"
  echo "Go look in ${SEED_DIR} for files that match the pattern '*.farcaster.*.csv' and choose the timestamp where you want to start e.g. '2024-06-25-105415'."
  exit 1
}


# Check if the comparison string is provided
if [ -z "$1" ]; then
    usage
fi

# Initialize flag
truncate_set=true

# Parse options
if [[ "$2" == "--no_truncate" ]]; then
  truncate_set=false
fi


# Define the directory to search (can be customized)
directory=${SEED_DIR}

# Define the file pattern to match
pattern="*.farcaster.*.csv"

# Get the comparison string from the command line argument
compare_string="$1"

# Find files matching the pattern
matching_files=$(find "$directory" -type f -name "$pattern")


# Function to get table name from file name
get_table_name() {
    local file_name="$1"
    local table_name=$(echo "$file_name" | sed -E 's/.*\.farcaster\.(.+)\.csv/\1/')
    echo "$table_name"
}


# Filter files that are greater than the given string and operate on them
for file in $matching_files;
do
    # Extract the base name of the file (to compare just the file name)
    filename=$(basename "$file")

    if [[ "$filename" > "$compare_string" ]];
    then
        echo "Processing file: $filename"

        # Get the table name
        table_name=$(get_table_name "$file")

        # test if truncate is set
        if [ "$truncate_set" = true ]; then
            echo
            echo "Truncating table farcaster.$table_name"
            command="psql postgres://postgres@localhost:5432/postgres -c \"TRUNCATE TABLE farcaster.$table_name;\""
            echo "Executing: $command"
            eval "$command"
        fi

        # Construct and execute the COPY command
        command="psql postgres://postgres@localhost:5432/postgres -c \"\COPY farcaster.$table_name FROM '$file' CSV HEADER;\""

        echo "Executing: $command"
        eval "$command"

        echo "Finished copying data from $file to farcaster.$table_name"
        echo

        # Add your processing commands here
        # For example, you could run some command on the file
        # command "$file"
    fi
done



