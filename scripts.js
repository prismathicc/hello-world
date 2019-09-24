	var pickedId = '';
	var firstParent;
	var opponent;
	var opponentFirstParent;
	var highlighted;
	var sizeMode = 'scroll';
	var miniTableData = [2,2];
	var miniItemData = ['2;2','Элемент','lightblue'];
	function pick(e,w,h,mx,my){
		var width = e.offsetWidth;
		var height = e.offsetHeight;
		e.style.transform = 'scale(0.75)';
		e.style.opacity = .7;
		pickedId = e.id;
		firstParent = e.parentElement;
		e.style.position = 'absolute';
		e.style.width = width+'px';
		e.style.height = height+'px';
		e.style.transition = '';
		e.style.top = my/h*100+'%';
		e.style.left = mx/w*100+'%';
		var highlight = e.parentElement;
		if(pickedId !== ''){
			if(e !== highlighted && highlighted !== undefined){
				highlighted.firstChild.style.display = 'none';
			}
			highlighted = e.parentElement;
			highlighted.style.borderColor = 'black';
		}
	}
	function move(w,h,mx,my,target){
		if(pickedId !== ''){
			var item = document.getElementById(pickedId);
			item.style.top = my/h*100+'%';
			item.style.left = mx/w*100+'%';
			if(target == document.body){
				put();
			}
		}
	}
	function preview(e){
		var item = document.getElementById(pickedId);
		var secondItem = e.children[0];
		var cells = document.getElementsByClassName('cell');
		if(pickedId !== ''){
			if(e !== highlighted && highlighted !== undefined){
				highlighted.style.borderColor = 'rgba(0,0,0,.2)';
			}
			highlighted = e;
			e.style.borderColor = 'black';
		}
		if(e.classList.length == 1 && pickedId !== ''){
			var cells = document.getElementsByClassName('cell');
			e.classList.add(item.id);
			e.appendChild(item);
		}
		if(e.classList.length == 2 && pickedId !== '' && item.parentElement !== e){
			if(opponent == undefined){
				opponent = secondItem;
				opponentFirstParent = e;
			}
			e.classList.add(item.id);
			firstParent.classList.add(secondItem.id);
			e.classList.remove(secondItem.id);
			firstParent.classList.remove(item.id);
			firstParent.appendChild(secondItem);
			e.appendChild(item);
		}
		for(var i=0;i<cells.length;i++){
			if(pickedId !== '' && cells[i] !== e && cells[i].classList.contains(item.id)){
				cells[i].classList.remove(item.id);
			}
		}
		if(e !== opponentFirstParent && opponent !== undefined){
			opponent.parentElement.classList.remove(opponent.id);
			opponentFirstParent.classList.add(opponent.id);
			opponentFirstParent.appendChild(opponent);
			if(opponent !== secondItem){
				opponent = secondItem;
				opponentFirstParent = e;
			}
		}
	}
	function put(){
		if(pickedId !== ''){
			var item = document.getElementById(pickedId);
			item.style.transform = '';
			item.style.opacity = 1;
			item.style.position = '';
			item.style.width = '100%';
			item.style.height = '100%';
			item.style.transition = 'all .1s ease';
			pickedId = '';
			firstParent = undefined;
			highlighted.style.borderColor = 'rgba(0,0,0,.2)';
			highlighted = undefined;
			opponent = undefined;
			opponentFirstParent = undefined;
		}
	}
	function generateTable(data){
			var main = document.getElementById('main');
			document.getElementById('table-wrap').remove();
			var tableWrap = document.createElement('div');
			tableWrap.id = 'table-wrap';
			main.appendChild(tableWrap);
			var data = miniTableData;
			for(var i=0;i<data[0];i++){
				var newcolumn = document.createElement('div');
				newcolumn.classList.add('column');
				newcolumn.style.width = 100/data[0]+'%';
				tableWrap.appendChild(newcolumn);
			}
			for(var i=0;i<tableWrap.children.length;i++){
				for(var j=0;j<data[1];j++){
					var newCell = document.createElement('div');
					newCell.classList.add('cell');
					newCell.onmousemove = function(){preview(this)};
					newCell.onmousedown = function(){hideSideDisplay()};
					newCell.oncontextmenu = function(){showSideDisplay();switchCreatePlace(this);itemLabel();generateMiniItem(this);event.preventDefault()}
					newCell.id = (i+1)+';'+(j+1)
					tableWrap.children[i].appendChild(newCell);
				}
			}
	}
	function generateMiniTable(data){
		var container = document.getElementById('table-block-preview-area');
		if(eval(data[0]) > 40 || eval(data[1]) > 40){
			container.innerHTML = 'Превышен лимит размера!'
		} else {
			miniTableData = data;
			if(document.getElementsByClassName('mini-table')[0] !== undefined){
				document.getElementsByClassName('mini-table')[0].remove();
			}
			container.innerHTML = '';
			var tableWrap = document.createElement('div');
			tableWrap.classList.add('mini-table');
			container.appendChild(tableWrap);
			for(var i=0;i<data[0];i++){
					var newcolumn = document.createElement('div');
					newcolumn.classList.add('mini-column');
					newcolumn.style.width = 100/data[0]+'%';
					tableWrap.appendChild(newcolumn);
				}
			for(var i=0;i<tableWrap.children.length;i++){
				for(var j=0;j<data[1];j++){
					var newCell = document.createElement('div');
					var newCellHL = document.createElement('div');
					newCell.classList.add('mini-cell');
					newCell.id = 'm'+(i+1)+';'+(j+1);
					newCell.style.height = 100/data[1]+'%';
					newCell.appendChild(newCellHL);
					tableWrap.children[i].appendChild(newCell);
				}
			}
		}
	}
	function generateItem(data,console){
		var tableWrap = document.getElementById('table-wrap');
		var items = document.getElementsByClassName('item');
		var newItem = document.createElement('div');
		if(console){
			var cell = document.getElementById(data[0]);
			newItem.classList.add('item');
			newItem.onmousedown = function(){pick(this,window.innerWidth,window.innerHeight,event.clientX,event.clientY,event.target)};
			newItem.innerHTML = data[1];
			newItem.style.backgroundColor = data[2];
			newItem.id = items.length;
			if(cell.children.length > 0){
				cell.children[0].remove();
			}
			cell.classList.add(newItem.id);
			cell.appendChild(newItem);
		} else {
			var cell = document.getElementById(miniItemData[0]);
			newItem.classList.add('item');
			newItem.onmousedown = function(){pick(this,window.innerWidth,window.innerHeight,event.clientX,event.clientY,event.target);generateMiniItem(this.parentElement);hideSideDisplay();hideSideDisplay()};
			newItem.oncontextmenu = function(){showSideDisplay();switchCreatePlace(this.parentElement);itemLabel();generateMiniItem(this.parentElement);event.preventDefault();put()}
			newItem.innerHTML = miniItemData[1];
			newItem.style.backgroundColor = miniItemData[2];
			newItem.id = items.length;
			cell.appendChild(newItem);
			if(cell.children.length > 0){
				cell.children[0].remove();
				cell.classList.remove(items.length-1);
			}
			cell.classList.add(newItem.id);
			cell.appendChild(newItem);
		}
	}
	function generateMiniItem(e){
		var container = document.getElementById('item-block-preview-area');
		var previousMiniItem = document.getElementsByClassName('mini-item')[0];
		if(previousMiniItem !== undefined){
			previousMiniItem.remove();
		}
		var takedCell = document.getElementById(e.id).children[0];
		var takedCellText,takedCellBG;
		if(takedCell == undefined){
			takedCellText = 'Пустой элемент';
			takedCellBG = 'white';
		} else {
			takedCellText = takedCell.innerText;
			takedCellBG = takedCell.style.backgroundColor;
		}
		var newItem = document.createElement('div');
		newItem.classList.add('mini-item');
		newItem.innerHTML = takedCellText;
		newItem.style.backgroundColor = takedCellBG;
		container.appendChild(newItem);
	}
	function changeMiniItem(data){
		var item = document.getElementById('item-block-preview-area').children[0];
		var coords = document.getElementById('item-block-input-area').children[0].innerText;
		item.innerHTML = data[1];
		item.style.backgroundColor = data[2];
		miniItemData = data;
	}
	function removeItem(){
		if(pickedId !== ''){
			document.getElementById(pickedId).parentElement.classList.remove(pickedId);
			document.getElementById(pickedId).remove();
			pickedId = '';
			highlighted.style.borderColor = 'rgba(0,0,0,.2)';
			highlighted = undefined;
		}
	}
	function switchSideDisplay(){
		var display = document.getElementById('settings-display');
		var mainDisplay = document.getElementById('main-display');
		if(display.style.opacity == 0){
			display.style.opacity = 1;
			display.style.left = '0%';
			mainDisplay.style.opacity = .5;
		} else {
			display.style.opacity = 0;
			display.style.left = '-100%';
			mainDisplay.style.opacity = 1;
		}
	}
	function hideSideDisplay(){
		var display = document.getElementById('settings-display');
		var mainDisplay = document.getElementById('main-display');
		display.style.opacity = 0;
		display.style.left = '-100%';
		mainDisplay.style.opacity = 1;
	}
	function showSideDisplay(){
		var display = document.getElementById('settings-display');
		var mainDisplay = document.getElementById('main-display');
		display.style.opacity = 1;
		display.style.left = '0%';
		mainDisplay.style.opacity = .5;
	}
	function switchLabel(){
		var label = document.getElementById('settings-main-block-label').children[0];
		var tableBlock = document.getElementById('settings-table-block');
		var itemBlock = document.getElementById('settings-item-block');
		if(label.innerText == 'Таблица'){
			tableBlock.style.display = 'none';
			itemBlock.style.display = 'block';
			label.innerHTML = 'Элементы';
		} else {
			tableBlock.style.display = 'block';
			itemBlock.style.display = 'none';
			label.innerHTML = 'Таблица';
		}
	}
	function itemLabel(){
		var label = document.getElementById('settings-main-block-label').children[0];
		var tableBlock = document.getElementById('settings-table-block');
		var itemBlock = document.getElementById('settings-item-block');
		tableBlock.style.display = 'none';
		itemBlock.style.display = 'block';
		label.innerHTML = 'Элементы';
	}
	function switchCreatePlace(e){
		var coords = document.getElementById('item-block-input-area').children[0];
		coords.innerHTML = e.id;
		miniItemData[0] = e.id;
	}
	function switchSizeMode(){
		var mainDisplay = document.getElementById('main-display');
		var main = document.getElementById('main');
		var tableWrap = document.getElementById('table-wrap');
		var cells = document.getElementsByClassName('cell');
		var viewLabel = document.getElementById('view-label');

		if(sizeMode == 'scroll'){
			mainDisplay.style.height = '100vh';
			mainDisplay.style.padding = '0';
			mainDisplay.style.alignItems = 'center';
			main.style.height = '65%';
			tableWrap.style.height = '100%';
			for(var i=0;i<cells.length;i++){
				cells[i].style.height = 100/miniTableData[1]+'%';
			}
			sizeMode = 'full-view'
		} else {
			mainDisplay.style.height = '';
			mainDisplay.style.paddingTop = '20vh';
			mainDisplay.style.alignItems = '';
			main.style.height = '';
			tableWrap.style.height = '';
			for(var i=0;i<cells.length;i++){
				cells[i].style.height = '150px';
			}
			sizeMode = 'scroll';
		}
	}

	generateTable();
	generateMiniTable([2,2]);
	generateMiniItem(document.getElementById('1;1'));

	document.body.onload = function(){
		var preloader = document.getElementById('preloader-display');
		setTimeout(function(){
			preloader.style.animation = 'fade 2s 1 ease';
			setTimeout(function(){
				preloader.style.display = 'none';
			},2000)
		},1000)
	}