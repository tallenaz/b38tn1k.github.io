class Cells {
  constructor(c, h, l, i, dt) {
    this.cells = [];
    this.dWidth = 80;
    this.dHeight = 40;
    this.dRadius = 5;
    this.activeIndex = -1;
    this.colors = c;
    this.highlights = h;
    this.lowlights = l;
    this.inverted = i;
    this.dualtone = dt;
    this.varNames = 'abcdefghijklmnopqrstuvwxyz';
    this.varHandles = ['none'];
    this.map = {};
    this.run = false;
  }

  get length() {
    return this.cells.length;
  }

  addCell(type, startX) {
    let x = startX;//0.15 * windowWidth;
    let y = 17;
    // let width = this.dWidth;
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    if (type == T_START) {
      c = [this.colors[type], this.highlights[type], this.colors[49], this.inverted[type], this.dualtone[type]];
    }
    let width = this.dWidth;
    if (type == T_CONSOLE) {
      width *= 2;
    }
    this.cells.push(new Cell(type, x, y, width, this.dHeight, c, this.dRadius));
    let pIndex = this.length - 1;
    if (type == T_INPUT) {
      let tempID = this.getID(4);
      this.cells[pIndex].outletHandleSH= tempID;
      this.cells[pIndex].textLabel += ' ' + tempID;
      this.cells[pIndex].indexLabeldiv.html(this.cells[pIndex].textLabel);
      this.varHandles.push(tempID);
    }
    if (type == T_IF || type == T_WHILE) {
      this.cells.push(new Cell(T_CONDITION, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      this.cells.push(new Cell(T_DO, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      this.cells.push(new Cell(T_ELSE, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      for (let i = 1; i <= 3; i++) {
        this.cells[pIndex].addChild(pIndex + i, this.cells[pIndex + i], true);
        this.cells[pIndex + i].addParent(pIndex, this.cells[pIndex], true);
      }
      this.cells[pIndex].moveC(this.cells[pIndex].x, this.cells[pIndex].y);
    }

    let theOnesWithOutlets = [T_ASSIGN, T_EQUAL,T_LESS,T_GREATER,T_ADD,T_SUBTRACT,T_MULT,T_DIV,T_MOD];
    let thisOneHasAnOutlet = false;
    for (let i = 0; i < theOnesWithOutlets.length; i++) {
      if (type == theOnesWithOutlets[i]) {
        thisOneHasAnOutlet = true;
      }
    }
    if (thisOneHasAnOutlet == true) {
      this.cells.push(new Cell(T_OUTLET, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      this.cells[pIndex].addChild(pIndex + 1, this.cells[pIndex + 1]);
      this.cells[pIndex + 1].addParent(pIndex, this.cells[pIndex]);
      let tempID = this.getID(4);
      this.cells[pIndex + 1].outletHandleSH= tempID;
      this.cells[pIndex + 1].textLabel += ' ' + tempID;
      this.cells[pIndex + 1].indexLabeldiv.html(this.cells[pIndex + 1].textLabel);
      this.cells[pIndex + 1].updateDataSH('unset');
      this.varHandles.push(tempID);
    }
    if (type == T_BLOCK) {
      this.cells[pIndex].input.value(this.getID(1) + " block", this.getID(1) + " block");
      this.cells[pIndex].funcHandleSH = this.cells[pIndex].input.value();
    }
    this.cells[pIndex].reshape();
    if (type != T_START && type != T_CONSOLE) {
      this.cells[pIndex].mode = M_NEW;
      this.activeIndex = pIndex;
    }
  }

  getID(count) {
    let tempID = '';
    for (let i = 0; i < count; i++) {
      tempID += this.varNames[floor(random(0, this.varNames.length))];
    }
    if (this.varHandles.indexOf(tempID) != -1) {
      tempID = this.getID();
    }

    return tempID;
  }

  checkSelected(x, y) {
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].inArea(x, y) === true) {
        this.cells[i].mode = M_SELECTED;
        if (this.cells[i].checkButtons(x, y) === true) {
          this.activeIndex = i;
          break;
        }
      } else {
        this.cells[i].mode = M_IDLE;
        this.activeIndex = -1;
      }
    }
  }

  pprint(myStr) {
    myStr += '\ncell:     \t'
    for (let i = 0; i < this.cells.length; i++){
      myStr += String(i) + '\t';
    }
    myStr += '\nmode:  \t';
    for (let i = 0; i < this.cells.length; i++){
      myStr += String(this.cells[i].mode) + '\t';
    }
    myStr += '\n#child: \t';
    for (let i = 0; i < this.cells.length; i++){
      myStr += String(this.cells[i].childIndicies.length) + '\t';
    }
    myStr += '\nChild Indicies for Cell: \n';
    for (let i = 0; i < this.cells.length; i++){
      if (this.cells[i].childIndicies.length > 0) {
        myStr += 'Cell ' + String(i) + '\t\t\t';
        for (let j = 0; j < this.cells[i].childIndicies.length; j++) {
          myStr += String(this.cells[i].childIndicies[j]) + '\t'
        }
        myStr+='\n'
      }
    }
  }

  startStop(x, y, mdown) {
    this.run = ! this.run;
    this.cells[this.activeIndex].mode = M_IDLE;
    this.cells[this.activeIndex].toggleStartForm(this.run);
  }

  stop() {
    this.run = false;
    this.cells[0].toggleStartForm(false);
  }

  doDelete(x, y, mdown) {
    let rebuildFlag = false;
    let delHandle = [];
    if (this.length == 1) { // last cell
      this.cells[0].cleanForDeletionSafe();
      this.cells = [];
    } else {
      // recursive call to find all children to also be deleted
      this.cells[this.activeIndex].markForDeletion();
      let map = []; // for the 'survivors'
      for (let i = 0; i < this.length; i++) {
        if (this.cells[i].mode != M_DELETE){
          map.push(i); // find all cells that will not be deleted
        } else {
          if (this.cells[i].hasHandle == true) {
            rebuildFlag = true;
            if (this.cells[i].type == T_BLOCK) {
              delHandle.push(this.cells[i].funcHandleSH);
            } else {
              delHandle.push(this.cells[i].outletHandleSH);
            }
            this.varHandles.splice(this.varHandles.indexOf(this.cells[i].outletHandleSH), 1);
          }
        }
        // remove parent / child links and divs for those in delete mode
        let parent = this.cells[i].cleanForDeletionSafe();
        if (parent != -1){
          this.cells[parent].removeChild(i);
        }
      }
      // reassign parent/child relationship
      for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this.cells[i].childIndicies.length; j++) {
          let oldCI = this.cells[i].childIndicies[j]
          let oldPI = i;
          let newCI = map.indexOf(oldCI);
          let newPI = map.indexOf(oldPI);
          this.cells[oldCI].parent = newPI;
          this.cells[i].childIndicies[j] = newCI;
        }
      }
      // recreate the cell list
      let newCells = [];
      for (let i = 0; i < map.length; i++) {
        newCells.push(this.cells[map[i]]);
      }
      this.cells = newCells;
    }
    this.activeIndex = -1;
    if (rebuildFlag === true) {
      for (let i = 0; i < this.length; i++) {
        if (this.cells[i].hasSelect == true) {
          this.cells[i].input.remove();
          if (this.cells[i].type != T_GOTO){
            this.cells[i].varLabeldiv.remove();
          }
          this.cells[i].buildDivs();
        }
      }
      for (let i = 0; i < this.length; i++) {
        if (this.cells[i].hasSelect == true) {
          if (delHandle.indexOf(this.cells[i].inletHandleSH) == -1) {
            this.cells[i].input.option(this.cells[i].inletHandleSH);
            this.cells[i].input.selected(this.cells[i].inletHandleSH);
          }
        }
      }
    }
  }

  doMove(x, y, mdown) {
    this.cells[this.activeIndex].moveC(x, y);
    if (this.cells[this.activeIndex].parent != -1) {
      this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
      this.cells[this.activeIndex].removeParent();
    }
  }

  doParentDrop(x, y, mdown) {
    let pParentIndex = -1;
    if (this.cells[this.activeIndex].type != T_START) {
      for (let i = 0; i < this.length; i++) {
        if (this.cells[i].inArea(x, y) === true && i != this.activeIndex) {
          this.cells[i].highlight = mdown;
          pParentIndex = i;
        } else {
          this.cells[i].highlight = false;
        }
      }
    }
    // release
    if (mdown === false && this.cells[this.activeIndex].mode == M_MOVE) {
      // create parent/child link and initial align
      if (pParentIndex != -1) {
        if (this.cells[this.activeIndex].parent != -1) {
          this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
          this.cells[this.activeIndex].removeParent();
        }
        let ok = this.cells[pParentIndex].addChild(this.activeIndex, this.cells[this.activeIndex]);
        if (ok == true) {
          this.cells[this.activeIndex].addParent(pParentIndex, this.cells[pParentIndex]);
          this.cells[pParentIndex].moveC(this.cells[pParentIndex].x, this.cells[pParentIndex].y);
        }
      }
      this.cells[this.activeIndex].mode = M_IDLE;
      this.activeIndex = -1;
    }
  }

  mapAndLink() {
    let blocks = [];
    this.map = {};
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].type in this.map) {
        this.map[this.cells[i].type].add(i);
      } else {
        this.map[this.cells[i].type] = new Set();
        this.map[this.cells[i].type].add(i);
      }
      blocks.push('none');
      // make pretty
      this.cells[i].reshape();
      // read from block names
      if (this.cells[i].type == T_BLOCK && this.cells[i].mode != M_SELECTED) {
        let v = this.cells[i].input.value();
        if (v.length > 0) {
          blocks.push(v);
          this.cells[i].updateFuncHandleSH(v);
        }
      }
    }
    // linking (oof)
    for (key in this.map) {
      if (key == T_GOTO) {
        for (let i of this.map[key]) {
          for (let j = 0; j < blocks.length; j++) {
            this.cells[i].input.option(blocks[j], blocks[j]);
          }
          this.cells[i].inletHandleSH = this.cells[i].input.value();
          this.cells[i].outletHandleSH = this.cells[i].input.value();
        }

      }
      if (key == T_VAR) {
        for (let vi of this.map[key]) {
          for (let j = 0; j < this.varHandles.length; j++) {
            this.cells[vi].input.option(this.varHandles[j], this.varHandles[j]);
          }
          this.cells[vi].inletHandleSH = this.cells[vi].input.value();
          for (key in this.map) {
            if (key == T_INPUT) {
              for (let ii of this.map[key]) {
                if (this.cells[vi].inletHandleSH == this.cells[ii].outletHandleSH) {
                  this.cells[vi].updateDataSH(this.cells[ii].input.value());
                }
              }
            }

            if (key == T_OUTLET) {
              for (let oi of this.map[key]) {
                if (this.cells[vi].inletHandleSH == this.cells[oi].outletHandleSH) {
                  this.cells[vi].updateDataSH(this.cells[oi].dataSH);
                }
              }
            }
          }
        }
      }
    }
  }

  update(x, y, mdown) {
    this.cells[0].startButtonHighlight(x, y);
    // build mode
    if (this.run == false) {
      // active cell
      if (this.activeIndex != -1) {
        if (this.cells[this.activeIndex].mode == M_NEW){
          if (mdown == false) {
            this.doMove(x, y, true);
          }
          if (mdown == true) {
            this.cells[this.activeIndex].mode = M_IDLE;
            this.activeIndex = -1;
          }

        }
        if (this.cells[this.activeIndex].mode == M_START){
          this.startStop(x, y, mdown);
        }
        // deleting
        if (this.cells[this.activeIndex].mode == M_DELETE){
          this.doDelete(x, y, mdown);
        } else {
          // move
          if (mdown === true && this.cells[this.activeIndex].mode == M_MOVE) {
            this.doMove(x, y, mdown);
          }
          // resize
          if (mdown === true && this.cells[this.activeIndex].mode == M_RESIZE) {
            this.cells[this.activeIndex].resizeC(x, y);
          }
          if (mdown === true && this.cells[this.activeIndex].mode == M_EXPAND_OR_COLLAPSE) {
            this.cells[this.activeIndex].expandOrCollapse();
          }
          this.doParentDrop(x, y, mdown)
        }
      }
      this.mapAndLink();
    } else { // RUN MODE!!!
      // stop button
      if (this.cells[0].mode == M_START){
        this.startStop(x, y, mdown);
      }
      // and NOTHING ELSE CAUSE I SHOULD MAKE A NEW THING!
    }
  }

  draw(canvas = null) {
    for (let i = 0; i < this.length; i++) {
      this.cells[i].draw();
    }
    if (this.activeIndex != -1) {
      this.cells[this.activeIndex].draw();
    }
  }

};