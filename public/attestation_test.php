<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#ccc; }

.page {
    width: 210mm;
    min-height: 297mm;
    margin: 20px auto;
    position: relative;
    overflow: hidden;
    background: #FBF6E8;
}

/* BANDE ROUGE GAUCHE */
.deco-gauche {
    position: absolute;
    top: 0; left: 0;
    width: 42px;
    height: 100%;
    z-index: 2;
    background: #8B0000;
}
.deco-gauche::after {
    content: '';
    position: absolute;
    top: 0; right: -4px;
    width: 5px;
    height: 100%;
    background: #D4AF37;
}

/* BANDE ROUGE DROITE */
.deco-droite {
    position: absolute;
    top: 0; right: 0;
    width: 35px;
    height: 100%;
    z-index: 2;
    background: #8B0000;
}
.deco-droite::before {
    content: '';
    position: absolute;
    top: 0; left: -4px;
    width: 5px;
    height: 100%;
    background: #D4AF37;
}

/* BANDE ROUGE BAS */
.deco-bas {
    position: absolute;
    bottom: 0; left: 0;
    width: 100%;
    height: 35px;
    z-index: 2;
    background: #8B0000;
}
.deco-bas::before {
    content: '';
    position: absolute;
    top: -4px; left: 0;
    width: 100%;
    height: 4px;
    background: #D4AF37;
}
</style>
</head>
<body>
<div class="page">
    <div class="deco-gauche"></div>
    <div class="deco-droite"></div>
    <div class="deco-bas"></div>
</div>
</body>
</html>