#!/bin/bash

# HTTP HEADER
echo "Content-type: text/html"
echo

( 
	echo '<isindex prompt="Search Document... " />'
	
	if [ "$#" != "0" ]
	then
		for i in popeyes mcdonalds white-castle
		do
			echo "<h1>$i</h1>"
		
			OUTPUT=`grep -i $1 $i.csv`
		
			if [ "$?" != "0" ]
			then
				echo "\"$1\" is not available at $i"
			else 
				OUTPUT=`echo "$OUTPUT" | awk -F'$'  '{printf("<tr><td>%s</td><td>%s</td></tr>\n", $1, $2)}'`
				echo "<table border='1'>$OUTPUT</table>"
			fi
		done
	fi

) | tidy -indent -utf8  2> /dev/null 

