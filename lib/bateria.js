exports.nivel = (batanu) => {
	let nv = (batanu <= 10) ? `${'░'.repeat(9)}` : (batanu <= 20) ? '█▒' + `${'░'.repeat(7)}` : (batanu <= 30) ? `${'█'.repeat(2) + '▒' + '░'.repeat(6)}` : (batanu <= 40) ? `${'█'.repeat(3) + '▒' + '░'.repeat(5)}` : (batanu <= 50) ? `${'█'.repeat(4) + '▒' + '░'.repeat(4)}` : (batanu <= 60) ? `${'█'.repeat(5) + '▒' + '░'.repeat(3)}` : (batanu <= 70) ? `${'█'.repeat(6) + '▒' + '░'.repeat(2)}` : (batanu <= 80) ? `${'█'.repeat(7) + '▒░'}` : (batanu <= 90) ? `${'█'.repeat(8) + '░'}` : (batanu <= 100) ? `${'█'.repeat(9)}` : ''
			return `[█${nv}] ${batanu}%`
	}