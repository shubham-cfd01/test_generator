let timerInterval;
let timeLeft = (typeof TIMER_MINS !== 'undefined' ? TIMER_MINS : 10) * 60;
let testSubmitted = false;

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        if (testSubmitted) { clearInterval(timerInterval); return; }
        timeLeft--;
        timerElement.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatTime(timeLeft)}`;
        if (timeLeft <= 60) timerElement.classList.add('warning');
        if (timeLeft <= 0) { clearInterval(timerInterval); submitTest(); }
    }, 1000);
}

async function submitTest() {
    if (testSubmitted) return;
    const form = document.getElementById('test-form');
    if (!form.checkValidity() && timeLeft > 0) { form.reportValidity(); return; }
    testSubmitted = true;
    clearInterval(timerInterval);

    const btn = document.getElementById('submit-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;

    const formData = new FormData(form);
    const answers = {};
    for (let [key, value] of formData.entries()) { answers[key] = value; }

    try {
        const response = await fetch(`/series/submit/${TEST_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answers)
        });
        const data = await response.json();
        if (response.ok) {
            showResults(data);
        } else {
            alert('Error: ' + (data.error || 'Unknown error'));
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Test';
            btn.disabled = false;
            testSubmitted = false;
        }
    } catch (error) {
        alert('Network error while submitting test.');
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Test';
        btn.disabled = false;
        testSubmitted = false;
    }
}

function showResults(data) {
    document.getElementById('test-form').classList.add('hidden');
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.remove('hidden');

    document.getElementById('score-text').innerText = data.score;
    document.getElementById('total-text').innerText = data.total;

    if (data.marks_total && data.marks_total > 0) {
        const marksDiv = document.getElementById('marks-display');
        marksDiv.style.display = 'block';
        marksDiv.innerHTML = `Marks: ${data.marks_scored} / ${data.marks_total}`;
    }

    setTimeout(() => {
        document.getElementById('progress-bar').style.width = `${data.percentage}%`;
    }, 100);

    let count = 0;
    const interval = setInterval(() => {
        if (count >= data.percentage) {
            clearInterval(interval);
            document.getElementById('percentage-text').innerText = `${data.percentage}%`;
        } else {
            count++;
            document.getElementById('percentage-text').innerText = `${count}%`;
        }
    }, 20);

    const msgElement = document.getElementById('message-text');
    if (data.percentage === 100) {
        msgElement.innerText = "Outstanding! Perfect Score! 🌟";
    } else if (data.percentage >= 80) {
        msgElement.innerText = "Excellent work! Keep it up! 🎯";
    } else if (data.percentage >= 60) {
        msgElement.innerText = "Good job! You passed the test. 👍";
    } else {
        msgElement.innerText = "Keep practicing! You'll do better next time. 💪";
        document.querySelector('.celebration i').className = "fa-solid fa-book-open";
        document.querySelector('.celebration').style.color = "var(--primary)";
    }

    const container = document.querySelector('.container');
    const form = document.getElementById('test-form');
    form.classList.remove('hidden');
    document.querySelector('.actions').classList.add('hidden');
    container.insertBefore(resultsContainer, form);

    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);

    data.results.forEach(result => {
        const feedbackDiv = document.getElementById(`feedback-${result.id}`);
        feedbackDiv.classList.remove('hidden');
        const card = document.getElementById(`q-card-${result.id}`);
        if (result.is_correct) {
            feedbackDiv.classList.add('correct');
            feedbackDiv.innerHTML = `<i class="fa-solid fa-check-circle"></i> Correct!`;
            card.style.borderColor = "var(--success)";
        } else {
            feedbackDiv.classList.add('incorrect');
            feedbackDiv.innerHTML = `<i class="fa-solid fa-times-circle"></i> Incorrect. The correct answer was: <strong>${result.correct_answer}</strong>`;
            card.style.borderColor = "var(--danger)";
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
