document.addEventListener('DOMContentLoaded', function () {
	const randomImage = document.getElementById('randomImage');
	const loadingContainer = document.getElementById('loadingContainer');
	const themeToggle = document.getElementById('themeToggle');
	const errorMsg = document.getElementById('errorMsg');
	const loadingText = document.getElementById('loadingText');

	function initTheme() {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'dark') {
			document.body.classList.add('dark-mode');
			themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
		} else {
			themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
		}
	}

	function toggleTheme() {
		document.body.classList.toggle('dark-mode');
		if (document.body.classList.contains('dark-mode')) {
			localStorage.setItem('theme', 'dark');
			themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
		} else {
			localStorage.setItem('theme', 'light');
			themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
		}
	}

	function showLoader() {
		loadingContainer.style.display = 'flex';
	}

	function hideLoader() {
		loadingContainer.style.display = 'none';
	}

	async function scrapeRandomImage() {
		showLoader();

		const response = await fetch(`/scrape`);
		const data = await response.json();

		if (data.error) {
			errorMsg.textContent = data.error;
			hideLoader();
		} else if (data.success) {
			randomImage.src = data.imageUrl;
			randomImage.style.display = 'block';
			loadingText.innerHTML = '<i class="fa-solid fa-circle-check"></i> Now loading the image...';
			randomImage.onload = () => {
				hideLoader();
			};
			document.querySelector('.image-placeholder').style.display = 'none';
		} else {
			errorMsg.textContent = data.message;
			hideLoader();
		}
	}

	themeToggle.addEventListener('click', toggleTheme);

	initTheme();

	setTimeout(scrapeRandomImage, 500);
});