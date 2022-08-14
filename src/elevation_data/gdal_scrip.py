import os
from osgeo import gdal, ogr
import json
gdal.UseExceptions() # GDAL does not use python exceptions by default

def convertToJSON(COORD, REDUCE):
    cwd = os.path.dirname('/Applications/MAMP/htdocs/elevation_data/')
    img = os.path.join(cwd,COORD, 'img'+COORD+'_13.img')
    geo = gdal.Open(img)
    drv = geo.GetDriver()
    print drv.GetMetadataItem('DMD_LONGNAME')
    topo = geo.ReadAsArray()
    topo = topo.tolist()

    reducedList = []
    print ("Size of topo("+str(COORD)+"): " + str(len(topo)) + " reduced by increments of " + str(REDUCE))
    for x in range(0, len(topo), REDUCE):
        # print ("Size of topo y: " + str(len(topo[x])))
        reducedEntry = []
        for y in range(len(topo[x])-1, 0, -REDUCE):
            reducedEntry.append(topo[x][y])
            # print ("  "+str(x) + "," + str(y) + ": " + str(topo[x][y]))
        reducedList.append(reducedEntry)

    with open(COORD+'_f'+str(REDUCE)+'.json', 'wb') as outfile:
        json.dump(reducedList, outfile)


convertToJSON('n35w118', 1000)
convertToJSON('n35w118', 500)
convertToJSON('n35w118', 200)
convertToJSON('n35w118', 100)
convertToJSON('n35w118', 50)
convertToJSON('n35w118', 20)
# convertToJSON('n35w119', 10)
