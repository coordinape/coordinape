#!/bin/bash

SCRIPT_DIR=$(dirname "$(realpath "$0")")
SEED_DIR=${SCRIPT_DIR}/../seed/farcaster

usage() {
  echo "Usage: $0 <search-term> (--no_truncate)"
  echo "Search in ${SEED_DIR} for files that match the search term and choose the timestamp where you want to start e.g. 'farcaster-2024-06-25-105415'."
  exit 1
}

# Check if the search term is provided
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

# Get the search term from the command line argument
search_term="$1"

# Find files matching the search term
matching_files=$(find "$directory" -type f -name "*${search_term}*.csv")

get_filename() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    echo "$filename"
}

# Function to get schema and table name from file name
get_schema_and_table_name() {
    local file_path="$1"
    local file_name=$(get_filename "$file_path")
    if [[ "$filename" =~ ^[^.]+\.(.+)\.(.+)\.csv$ ]]; then
        schema_name="${BASH_REMATCH[1]}"
        table_name="${BASH_REMATCH[2]}"
        echo "${schema_name}.${table_name}"
    else
        echo "Could not extract schema and table from $file_name"
        exit 1
    fi
}

# If $matching_files is empty, print a message and exit
if [ -z "$matching_files" ]; then
    echo "No files found matching the search term: $search_term"
    exit 1
fi

# Filter files that are greater than the given string and operate on them
for file in $matching_files;
do
    # Extract the base name of the file (to compare just the file name)
    filename=$(basename "$file")

    # if [[ "$filename" > "$search_term" ]];
    # then
        echo "Processing file: $filename"

        # Get the schema and table name
        schema_and_table_name=$(get_schema_and_table_name "$file")

        echo "Schema and table name: $schema_and_table_name"

        if [ $? -ne 0 ]; then
            continue # if schema and table name could not be extracted, move to the next file
        fi

        # Test if truncate is set
        if [ "$truncate_set" = true ]; then
            echo
            echo "Truncating table $schema_and_table_name"
            command="psql postgres://postgres@localhost:5432/postgres -c \"TRUNCATE TABLE $schema_and_table_name CASCADE;\""
            echo "Executing: $command"
            eval "$command"
        fi


#        # Disable triggers
#        command="psql postgres://postgres@localhost:5432/postgres -c \"ALTER TABLE $schema_and_table_name DISABLE TRIGGER ALL;\""
#        echo "Executing: $command"
#        eval "$command"

        # Construct and execute the COPY command
        command="psql postgres://postgres@localhost:5432/postgres -c \"\COPY $schema_and_table_name FROM '$file' CSV HEADER;\""

        echo "Executing: $command"
        eval "$command"


#       # Enable triggers
#        command="psql postgres://postgres@localhost:5432/postgres -c \"ALTER TABLE $schema_and_table_name ENABLE TRIGGER ALL;\""
#        echo "Executing: $command"
#        eval "$command"

        echo "Finished copying data from $file to $schema_and_table_name"
        echo

        # Add your processing commands here
        # For example, you could run some command on the file
        # command "$file"
    # fi
done
