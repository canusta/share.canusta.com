# share.canusta.com

Private file sharing for Canusta. Links look like `share.canusta.com/wallpaper-a1b2c3d4`.

## Setup

```bash
npm install
npm run dev
```

## Create a share

```bash
npm run new-share wallpaper
```

Add files to the generated `content/wallpaper-xxxxxxxx/` folder, then deploy.

## Structure

```
content/
  wallpaper-a1b2c3d4/
    meta.json      # optional title & description
    photo.jpg
    notes.pdf
```
