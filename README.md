# Satellite Elevation Map 3JS Render

<iframe width="700" height="394" src="https://www.youtube.com/embed/WVzanreSJsk" title="YouTube video player" frameborder="0" allow="clipboard-write; encrypted-media; picture-in-picture" allowfullscreen /> 

##

Rendering satellite elevation data in ThreeJs.

<img width="741" alt="Screen Shot 2021-12-20 at 6 15 54 PM" src="https://user-images.githubusercontent.com/8960690/146845194-fab64e5c-cff0-45db-af8f-de952200bf14.png">

## Real satellite elevation data

Browse and download public satellite data at: https://earthexplorer.usgs.gov

Elevation data density is reduced by python script here:
https://github.com/harrisonbalogh/satellite-elevation-map/blob/master/site/elevation_data/gdal_scrip.py

Can toggle between various elevation granularity settings when running in a browser:
https://github.com/harrisonbalogh/satellite-elevation-map/tree/master/site/elevation_data

## ThreeJS

Render engine used: https://threejs.org

## Local Dev

> `python3 -m http.server --cgi 8080`
