#!/usr/bin/python3

import hashlib
import mysql.connector
import os
from exif import Image

class ExifReader:

  def __init__(self):
    self.BASE_PATH = "/home/leonard/dev/photobox/data/images"

    self.db = mysql.connector.connect(
      host="localhost",
      user="test",
      password="test",
      database="photobox",
    )

    # get a dictionary of all known path/hash combinations
    cursor = self.db.cursor()
    cursor.execute("SELECT path, hash FROM media")
    self.hashes = dict(cursor.fetchall())

    # walk through all files and add them to the database
    self.walk(self.BASE_PATH)

  # converts the exif coordinates to decimal coordinates
  def getDecimalChoords(self, coords, ref):
    result = coords[0] + (coords[1] / 60.0) + (coords[2] / 3600.0)
    if ref == "S" or ref == "W":
      result = -result
    return result

  # returns a dictionary with all exif data
  def getExifData(self, imgBytes):
    img = Image(imgBytes)
    return {
      "datetime" : img.datetime,
      "make"     : img.make,
      "model"    : img.model,
      "latitude" : self.getDecimalChoords(img.gps_latitude, img.gps_latitude_ref),
      "longitude": self.getDecimalChoords(img.gps_longitude, img.gps_longitude_ref),
    }

  def handleFile(self, path):
    relPath = os.path.relpath(path, self.BASE_PATH)
    if not (path.lower().endswith(".jpg") or path.lower().endswith(".jpeg")):
      return

    with open(path, "rb") as f:
      file = f.read()

      # check if file is already in database
      fileHash = hashlib.sha256(file).hexdigest()
      if self.hashes.get(relPath, "None") == fileHash:
        # file is in database and has not changed
        return

      # read exif data and store them
      try:
        exif = self.getExifData(file)
      except Exception:
        return

      cursor = self.db.cursor()
      cursor.execute("INSERT INTO media (path, hash, datetime, make, model, latitude, longitude) VALUES (%s, %s, %s, %s, %s, %s, %s)", (relPath, fileHash, exif["datetime"], exif["make"], exif["model"], exif["latitude"], exif["longitude"]))
      self.db.commit()

  def walk(self, path):
    for root, dirs, files in os.walk(path, followlinks=True):
      for item in files:
        self.handleFile(os.path.join(root, item))

if __name__ == "__main__":
  ExifReader()
