document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generator-form');
    const loading = document.getElementById('loading');
    const errorAlert = document.getElementById('error-message');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        errorAlert.classList.add('hidden');
        loading.classList.remove('hidden');

        const checkedTopics = Array.from(document.querySelectorAll('input[name="topics"]:checked')).map(cb => cb.value);
        if (checkedTopics.length === 0) {
            showError("Please select at least one topic.");
            loading.classList.add('hidden');
            return;
        }

        const payload = {
            topics: checkedTopics,
            mcq_count: document.getElementById('mcq_count').value,
            fib_count: document.getElementById('fib_count').value,
            desc_count: document.getElementById('desc_count').value,
            geo_count: document.getElementById('geo_count').value,
            easy_pct: document.getElementById('easy_pct').value,
            medium_pct: document.getElementById('medium_pct').value,
            tough_pct: document.getElementById('tough_pct').value,
            student_name: document.getElementById('student_name').value,
            class_sec: document.getElementById('class_sec').value,
            roll_no: document.getElementById('roll_no').value,
            test_date: document.getElementById('test_date').value,
            test_time: document.getElementById('test_time').value,
            max_marks: document.getElementById('max_marks').value,
            phone_no: document.getElementById('phone_no').value,
            email_id: document.getElementById('email_id').value
        };

        const totalPct = parseInt(payload.easy_pct) + parseInt(payload.medium_pct) + parseInt(payload.tough_pct);
        if (totalPct < 90 || totalPct > 110) {
            showError("Total difficulty percentage should be close to 100%. Current total: " + totalPct + "%");
            loading.classList.add('hidden');
            return;
        }

        const totalQ = parseInt(payload.mcq_count) + parseInt(payload.fib_count) +
            parseInt(payload.desc_count) + parseInt(payload.geo_count);
        if (totalQ === 0) {
            showError("Please request at least one question.");
            loading.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                const requestId = data.request_id;

                // Start listening to Server-Sent Events for progress
                const source = new EventSource(`/progress/${requestId}`);

                source.onmessage = function (event) {
                    const statusData = JSON.parse(event.data);

                    if (statusData.error) {
                        showError(statusData.error);
                        source.close();
                        loading.classList.add('hidden');
                        return;
                    }

                    progressText.textContent = statusData.status;
                    progressFill.style.width = statusData.progress + '%';

                    if (statusData.progress >= 100) {
                        source.close();
                        setTimeout(() => {
                            loading.classList.add('hidden');
                            window.location.href = `/download/${requestId}`;
                            setTimeout(() => alert('PDF successfully generated and downloaded!'), 500);
                        }, 1000);
                    }
                };

                source.onerror = function () {
                    showError('Lost connection to server while generating.');
                    source.close();
                    loading.classList.add('hidden');
                };

            } else {
                const data = await response.json();
                showError(data.error || 'Failed to start generation. Make sure Ollama is running.');
                loading.classList.add('hidden');
            }
        } catch (error) {
            showError('Network error. Make sure the server is running and try again.');
            loading.classList.add('hidden');
        }
    });

    function showError(msg) {
        errorAlert.textContent = msg;
        errorAlert.classList.remove('hidden');
    }
});
