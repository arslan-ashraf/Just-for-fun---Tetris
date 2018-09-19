let canvas = document.querySelector('.tetrisboard')
let context = canvas.getContext('2d')

context.scale(20, 20)

let player = { position: { 'x': 5, 'y': 5 }, matrix: create_play_piece('T') }
let colors = ['', 'red', 'blue', 'green', 'yellow', 'white', 'orange']

function player_area_collide(play_area, player){
	for(let i = 0; i < player.matrix.length; i++){
		for(let j = 0; j < player.matrix[i].length; j++){
			 if (player.matrix[i][j] !== 0 &&
			 	(play_area[i + player.position.y] &&
				play_area[i + player.position.y][j + player.position.x]) !== 0){
			 	return true 
			}
		}
	}
	return false
}

function create_matrix(width, height){
	let m = Array(height).fill().map(() => Array(width).fill(0) )
	return m 
}

function create_play_piece(type_of_peice){
	if (type_of_peice == 'T'){
		return [
			[0,0,0],
			[1,1,1],
			[0,1,0],
		]
	}	else if (type_of_peice == 'O'){
		return [
			[2,2],
			[2,2],
		]
	}	else if (type_of_peice == 'L'){
		return [
			[0,3,0],
			[0,3,0],
			[0,3,3],
		]
	}	else if (type_of_peice == 'J'){
		return [
			[0,4,0],
			[0,4,0],
			[4,4,0],
		]
	}	else if (type_of_peice == 'I'){
		return [
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
		]
	}	else if (type_of_peice == 'S'){
		return [
			[0,6,6],
			[6,6,0],
			[0,0,0],
		]
	}
}

function player_matrix_merge(play_area, player){
	for(let i = 0; i < player.matrix.length; i++){
		for(let j = 0; j < player.matrix[i].length; j++){
			if (player.matrix[i][j] !== 0){
				play_area[i + player.position.y][j + player.position.x] = player.matrix[i][j]
			}
		}
	}
}

function start_filling(){
	context.fillStyle = 'black'
	context.fillRect(0, 0, canvas.width, canvas.height)
	fill_matrix(play_area, { 'x': 0, 'y': 0 })
	fill_matrix(player.matrix, player.position)
}

function fill_matrix(matrix, value){
	for(let i = 0; i < matrix.length; i++){
		for(let j = 0; j < matrix[i].length; j++){
			if (matrix[i][j] !== 0){
				context.fillStyle = colors[matrix[i][j]]
				context.fillRect(j + value.x, i + value.y, 1, 1)
			}
		}
	}
}


let last_time = 0
let drop_count = 0
let drop_time_interval = 1000

function player_drop(){
	player.position.y += 1 
	if (player_area_collide(play_area, player)){
		player.position.y -= 1 
		player_matrix_merge(play_area, player)
		reset_play_peice()
	}
	drop_count = 0
}

function player_move(direction){
	player.position.x += direction
	if(player_area_collide(play_area, player)){
		player.position.x -= direction
	}
}

function reset_play_peice(){
	let pieces = ['T', 'O', 'L', 'J', 'I', 'S']
	player.matrix = create_play_piece(pieces[Math.floor(Math.random() * pieces.length)])
	player.position.y = 0
	player.position.x = (play_area[0].length/2 | 0) - (player.matrix[0].length/2 | 0)
	if (player_area_collide(play_area, player)){
		play_area.map((x) => x.fill(0))
	}
}

function rotate_player(direction){
	let set_by = 1
	const x = player.position.x
	rotate_matrix(player.matrix, direction)
	while(player_area_collide(play_area, player)){
		player.position.x += set_by
		set_by = -(set_by + (set_by > 0 ? 1 : -1))
		if (set_by > player.matrix[0].length){
			rotate_matrix(player.matrix, -direction)
			player.position.x = x
			return
		}
	}
}

function rotate_matrix(matrix, direction){
	console.log(matrix)
	for(let i = 0; i < matrix.length; i++){
		for(let j = 0; j < i; j++){
			let temp = matrix[i][j]
			matrix[i][j] = matrix[j][i]
			matrix[j][i] = temp
		}
	}
	if (direction > 0){
		matrix.map((x) => x.reverse() )
	}	else {
		matrix.reverse()
	}
}

function update(time = 0){
	let time_difference = time - last_time
	last_time = time
	drop_count += time_difference
	if (drop_count > drop_time_interval){
		player_drop()
	}

	start_filling()
	requestAnimationFrame(update)
}

let play_area = create_matrix(12, 20)
// console.table(play_area)

document.addEventListener('keydown', event => {
	if (event.keyCode == 37){
		player_move(-1) 
	}	else if (event.keyCode == 39){
		player_move(1)
	}	else if (event.keyCode == 40){
		player_drop()
	}	else if (event.keyCode == 81){
		rotate_player(-1)
	}	else if (event.keyCode == 87){
		rotate_player(1)
	}
})

update()