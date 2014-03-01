import Image
import sys

# from http://stackoverflow.com/questions/138250/read-the-rgb-value-of-a-given-pixel-in-python-programatically

im = Image.open(sys.argv[1]) # Can be many different formats.
pix = im.load()
print im.size # Get the width and hight of the image for iterating over
print pix[0,0] # Get the RGBA Value of the a pixel of an image
