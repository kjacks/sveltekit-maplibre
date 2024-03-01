## Data 

(Parts adapted from https://medium.com/@mm1718/creating-clipped-base-maps-using-planetiler-and-osm-c-tools-1f726a68aa15)

1. Download OSM for Berlin area
    sudo docker run --rm -v "$(pwd)/data":/data ghcr.io/onthegomap/planetiler:latest --only_download --area=Berlin

2. Generate .mbtiles file from OSM data
    docker run --rm -v "$(pwd)/data":/data ghcr.io/onthegomap/planetiler:latest --osm_path=/data/sources/Berlin.osm.pbf ---mbtiles=/data/tilesets/berlin.mbtiles --maxzoom=15 --render_maxzoom=15

3. Remove all layers except building layer
    tile-join --layer=building -o berlin-buildings.mbtiles berlin.mbtiles

4. Extract polygon features from vector layer as geojson feature collection
    tippecanoe-decode -c berlin-buildings.mbtiles >> berlin-buildings-flat.geojson

5. Find intersections between exracted polygon features and Berlin Wall Building polygons (gebaeude_mauer_alter.geojson) and output a csv containing featureIds + properties to merge with that feature
    scripts/process_data.ipynb

6. Use csv to join properties from Berlin Wall Buildings to 3d layer
    tile-join -o berlin-buildings-enhanced.mbtiles -c intersections.csv berlin-buildings.mbtiles