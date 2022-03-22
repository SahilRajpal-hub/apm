#!/bin/bash
# set path to watch
DIR="/home/pi/Desktop/apm/Services/packets"
# set path to copy the script to
target_dir="/home/pi/Desktop/apm/Services/stats"

inotifywait -m -r -e moved_to -e create "$DIR" --format "%f" | while read f

do
    echo $f
    tshark -r "$DIR/$f" -Tek -e tcp.analysis.ack_rtt >> "$target_dir/$f".txt
    capinfos -i "$DIR/$f" | grep 'Data bit rate' | awk '{print $4}' >> "$target_dir/$f".throughput.txt
    mqtt pub -h 127.0.0.1 -t packetdata -m "$f"
    
done
