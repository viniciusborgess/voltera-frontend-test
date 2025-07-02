<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';

	let name = '';
	let debounceTimeout;
	const DEBOUNCE_DELAY = 700;

	export let data;

	// Atualiza a variável name com o valor da querystring ao carregar a página
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		name = params.get('name') || '';
	});

	// Atualiza a querystring da URL sempre que name mudar
	function updateQueryString(newName) {
		const params = new URLSearchParams(window.location.search);
		if (newName) {
			params.set('name', newName);
		} else {
			params.delete('name');
		}
		goto(`/?${params.toString()}`, { replaceState: true, keepfocus: true, noScroll: true });
	}

	function onInput(event) {
		const newName = event.target.value;
		name = newName;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			updateQueryString(newName);
		}, DEBOUNCE_DELAY);
	}
</script>

<style>
	:global(body) {
		background-color: #f8fafc;
		position: relative;
		min-height: 100vh;
		overflow-x: hidden;
		overflow-y: hidden;
	}
	:global(body)::before {
		content: '';
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background-image: radial-gradient(#469e7a 1.2px, transparent 1.2px),
		radial-gradient(#469e7a 1.2px, transparent 1.2px);
		background-size: 32px 32px;
		background-position: 0 0, 16px 16px;
		filter: blur(1.0px);
		opacity: 0.8;
	}

	main {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
		font-family: 'Segoe UI', Arial, sans-serif;
	}

	h1 {
		margin-bottom: 0.5em;
		color: #2d3748;
	}

	input[type="text"] {
		padding: 0.7em 1em;
		border: 1px solid #469e7a;
		border-radius: 8px;
		font-size: 1.1em;
		outline: none;
		transition: border-color 0.2s;
		margin-bottom: 1.5em;
		box-shadow: 0 2px 8px rgba(79, 209, 197, 0.08);
		text-align: center;
	}

	input[type="text"]:focus {
		border-color: #285e61;
	}

	p {
		font-size: 1.15em;
		color: #234e52;
		margin: 0.5em 0;
	}

	strong {
		color: #319795;
	}

	.glass-card {
		position: relative;
		z-index: 1;
		width: 420px;
		min-width: 320px;
		max-width: 95vw;
		min-height: 240px;
		margin-top: 3em;
		padding: 2.5em 3em 2.5em 3em;
		background: rgba(255, 255, 255, 0.18);
		box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.18);
		border: 1.5px solid #469e7a;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-radius: 22px;
		transition: box-shadow 0.7s, transform 0.8s, background 0.7s, border-color 0.7s;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-left: auto;
		margin-right: auto;
		position: relative;
		overflow: hidden;
	}
	.glass-card:hover {
		box-shadow: 0 20px 50px 0 rgba(31, 38, 135, 0.25);
		background: rgba(255, 255, 255, 0.28);
		transform: translateY(-3px) scale(101%);
		border-color: #469e7a;
	}
	.resultado {
		margin-top: 1.5em;
		text-align: center;
		font-size: 1em;
		color: #234e52;
		font-weight: 500;
	}
	.resultado .idade {
		color: #285e61;
		font-size: 1.25em;
		font-weight: bold;
	}

	.macos-dots {
		display: flex;
		gap: 0.5em;
		position: absolute;
		top: 1.1em;
		left: 1.3em;
		z-index: 2;
	}

	.dot {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		display: inline-block;
		box-shadow: 0 1px 2px rgba(0,0,0,0.10);
	}

	.dot.red {
		background: #ff5f56;
	}

	.dot.yellow {
		background: #555555;
	}

	.dot.green {
		background: #27c93f;
	}

	@media (max-width: 600px) {
		main {
			min-height: 100vh;
			padding: 0 0.5em;
		}
		.glass-card {
			width: 100%;
			min-width: unset;
			max-width: 100vw;
			padding: 1.2em 0.7em 1.2em 0.7em;
			margin-top: 1.2em;
			border-radius: 14px;
		}
		.macos-dots {
			gap: 0.3em;
			top: 0.7em;
			left: 0.7em;
		}
		.dot {
			width: 11px;
			height: 11px;
		}
		h1 {
			font-size: 1.3em;
			margin-bottom: 0.3em;
		}
		p {
			font-size: 1em;
		}
		input[type="text"] {
			font-size: 1em;
			padding: 0.5em 0.7em;
			margin-bottom: 1em;
		}
		.resultado {
			font-size: 0.98em;
		}
		.resultado .idade {
			font-size: 1.1em;
		}
	}
</style>

<main>
	<div class="glass-card">
		<div class="macos-dots">
			<span class="dot red"></span>
			<span class="dot yellow"></span>
			<span class="dot green"></span>
		</div>
		<h1>GuessMyAge</h1>
		<p>Digite um nome para estimar a idade:</p>
		<input
			type="text"
			bind:value={name}
			on:input={onInput}
			placeholder="Digite um nome..."
		/>

		{#if $navigating}
			<p>Carregando...</p>
		{/if}

		{#if data && data.result}
			<div class="resultado">
				{#if data.result.age}
					<p>O nome <strong>{data.result.name}</strong> tem idade estimada de <span class="idade">{data.result.age}</span> anos.</p>
				{:else}
					<p>Não foi possível estimar a idade para <strong>{data.result.name}</strong>.</p>
				{/if}
			</div>
		{/if}
	</div>
</main>
