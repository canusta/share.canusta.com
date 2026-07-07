# share.canusta.com

Private image sharing for Canusta.

Links look like `share.canusta.com/wallpaper-a3f8b2c1/1-doa93ks`

## Setup

```bash
npm install
npm run dev
```

## Create a folder

```bash
npm run new-share wallpaper
```

Creates an empty `content/wallpaper-xxxxxxxx/` folder.

## Add an image

```bash
npm run new-image wallpaper-a1b2c3d4 ~/Pictures/photo.jpg
```

Prints the share URL. Each image gets its own link.

## Structure

```
content/
  wallpaper-a1b2c3d4/       # empty folder
    1-doa93ks.jpg           # one image per link
    2-f8a2b1c.png
```
