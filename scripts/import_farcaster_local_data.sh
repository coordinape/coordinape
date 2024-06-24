#!/bin/bash

# Array of CSV files
csv_files=(
    "2024-06-24-farcaster.casts.csv"
    "2024-06-24-farcaster.fids.csv"
    "2024-06-24-farcaster.fnames.csv"
    "2024-06-24-farcaster.links.csv"
    "2024-06-24-farcaster.user_data.csv"
    "2024-06-24-farcaster.verifications.csv"
)

# Function to get table name from file name
get_table_name() {
    local file_name="$1"
    local table_name=$(echo "$file_name" | sed -E 's/2024-06-24-farcaster\.(.+)\.csv/\1/')
    echo "$table_name"
}

# Loop through each CSV file
for file in "${csv_files[@]}"; do
    # Get the table name
    table_name=$(get_table_name "$file")
    
    # Construct and execute the COPY command
    command="psql postgres://postgres@localhost:5432/postgres -c \"\COPY farcaster.$table_name FROM 'seed/farcaster/$file' CSV HEADER;\""
    
    echo "Executing: $command"
    eval "$command"
    
    echo "Finished copying data from $file to farcaster.$table_name"
    echo
done

echo "All files have been processed."
