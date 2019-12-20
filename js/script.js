'use strict';

class Puzzle {

  constructor(params) {
    this.canvas = params.canvas;
    this.context = params.context;
    this.matrix = params.matrix;
    this.rows = params.rows;
    this.cols = params.cols;
    this.sectorSize = params.sectorSize;
    this.switcherLong = params.switcherLong;
    this.switcherWidth = params.switcherWidth;
    this.audioTag = params.audioTag;

    this.canvas.addEventListener('click', (e) => {
      let mouseCoords = this.getMouseCoords(e);
      this.performClick(mouseCoords.x, mouseCoords.y);
      this.draw();
    }, false);
  }

  getMouseCoords(e) {
    let mouseX = e.pageX - this.canvas.offsetLeft;
    let mouseY = e.pageY - this.canvas.offsetTop;

    return {
      x: mouseX,
      y: mouseY
    };
  }

  init() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = Math.random() > 0.5 ? 1 : 0;
      }
    }
  }

  draw() {
    this.context.fillStyle = "#2B2B2B";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.context.strokeStyle = 'gray';
        this.context.strokeRect(this.sectorSize * i, this.sectorSize * j, this.sectorSize, this.sectorSize);
        let padding = this.setPadding(this.matrix[i][j]);
        if (this.matrix[i][j] === 1) {
          this.context.fillStyle = '#D6BF55';
          this.context.fillRect(
            this.sectorSize * i + padding.x,
            this.sectorSize * j + padding.y,
            this.switcherWidth,
            this.switcherLong);
        } else {
          this.context.fillStyle = '#CC7832';
          this.context.fillRect(
            this.sectorSize * i + padding.x,
            this.sectorSize * j + padding.y,
            this.switcherLong,
            this.switcherWidth);
        }
      }
    }
  }

  performClick(mouseX, mouseY) {
    let x = Math.floor(mouseX / this.sectorSize);
    let y = Math.floor(mouseY / this.sectorSize);
    if ((x >= 0) && (x <= this.rows) && (y >= 0) && (y <= this.cols)) {
      this.matrix[x][y] = 1 - this.matrix[x][y];
      for (let i = 0; i < this.rows; i++) {
        this.matrix[i][y] = 1 - this.matrix[i][y];
      }
      for (let j = 0; j < this.cols; j++) {
        this.matrix[x][j] = 1 - this.matrix[x][j];
      }
    }
    this.audioTag.currentTime = 0;
    this.audioTag.play();
  }

  setPadding(isVertical = 0) {
    let padding = {};
    let halfSectorSize = this.sectorSize / 2;
    if (isVertical === 1) {
      padding.x = halfSectorSize - this.switcherWidth / 2;
      padding.y = halfSectorSize - this.switcherLong / 2;
    } else {
      padding.x = halfSectorSize - this.switcherLong / 2;
      padding.y = halfSectorSize - this.switcherWidth / 2;
    }
    return padding;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  let resetBtn = document.getElementById('reset');
  let audioTag = document.querySelector('audio');
  let canvas = document.getElementById('pad');
  let context = canvas.getContext('2d');
  let sectorSize = 70;
  let switcherLong = 62;
  let switcherWidth = 20;

  resetBtn.onclick = function () {
    let matrix = [];
    let rows = document.getElementById('rows').value;
    let cols = document.getElementById('cols').value;

    canvas.width = rows * sectorSize;
    canvas.height = cols * sectorSize;
    for (let i = 0; i < rows; i++) {
      matrix.push([]);
      for (let j = 0; j < cols; j++) {
        matrix[i].push([]);
      }
    }

    let params = {
      canvas: canvas,
      context: context,
      matrix: matrix,
      rows: rows,
      cols: cols,
      sectorSize: sectorSize,
      switcherLong: switcherLong,
      switcherWidth: switcherWidth,
      audioTag: audioTag
    };

    let P = new Puzzle(params);
    P.init();
    P.draw();
  };

  resetBtn.click();
});

