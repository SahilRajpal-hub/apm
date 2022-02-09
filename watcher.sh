#!/bin/bash
# set path to watch
DIR="/home/sahil/Desktop/apm/Services/packets"
# set path to copy the script to
target_dir="/home/sahil/Desktop/apm/Services/stats"

inotifywait -m -r -e moved_to -e create "$DIR" --format "%f" | while read f

do
    echo $f
    # check if the file is a .sh file
    #if [[ $f = *.txt ]]; then
      # if so, copy the file to the target dir
      #mv "$DIR/$f" "$target_dir"
    tshark -r "$DIR/$f" -Tek -e tcp.analysis.ack_rtt >> "$target_dir/$f".txt
    capinfos -i "$DIR/$f" | grep 'Data bit rate' | awk '{print $4}' >> "$target_dir/$f".throughput.txt
    mqtt pub -h 127.0.0.1 -t packetdata -m "$f"
    # node publishFile.js "$f"

      # and rum it
      #/bin/bash "$target_dir/$f" &
   # fi
done
