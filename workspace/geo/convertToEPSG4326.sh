mkdir output
cd input
for FILE in *
do
  ogr2ogr \
  -f GeoJSON \
  "../output/$FILE" \
  -t_srs "EPSG:4326" \
  $FILE
done
