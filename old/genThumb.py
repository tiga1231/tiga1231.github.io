import media,math,shutil,os,Image
from os.path import splitext

img_folder_path = os.path.abspath('./images')
pics = os.listdir('./images')
counter = 1
EXT = ['jpg','png','gif']
for pic in pics:
    print pic
    try:
        if pic.split('.')[1] in EXT:
            new_name = str(counter) + '.' +pic.split('.')[1]
            os.rename(img_folder_path +'/'+ pic,
                      img_folder_path +'/'+ new_name)
            im = Image.open(img_folder_path +'/'+ new_name)
            counter += 1
            ratio = float(im.size[0])/im.size[1]
            MIN_DIMENSION = 300
            if im.size[0]<im.size[1]:
                width = MIN_DIMENSION
                height = int(width/ratio)
            else:
                height = MIN_DIMENSION
                width = int(height * ratio)
                
            im2 = im.resize( (width,height) , Image.BILINEAR )
            im2.save('./images/thumbs/'+new_name)
    except IndexError:
        continue
    
