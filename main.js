        let measurements = [];
        let isMessuring = false;

        function startMeasurement() {
            if (isMessuring) return;
            
            isMessuring = true;
            const measureBtn = document.getElementById('measureBtn');
            const temperatureDisplay = document.getElementById('temperatureDisplay');
            const temperatureStatus = document.getElementById('temperatureStatus');
            const mercury = document.getElementById('mercury');
            const scanLine = document.getElementById('scanLine');
            
            // Update button
            measureBtn.textContent = '⏳ Mengukur...';
            measureBtn.disabled = true;
            measureBtn.className = 'bg-gray-400 text-gray-600 px-8 py-4 rounded-full font-semibold text-lg cursor-not-allowed shadow-lg';
            
            // Show scan line
            scanLine.style.display = 'block';
            
            // Update status
            temperatureStatus.textContent = 'Sedang mengukur suhu tubuh...';
            temperatureDisplay.textContent = '--.-°C';
            
            // Simulate measurement process
            let progress = 0;
            const measurementInterval = setInterval(() => {
                progress += 2;
                mercury.style.height = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(measurementInterval);
                    completeMeasurement();
                }
            }, 40);
        }

        function completeMeasurement() {
            // Generate realistic temperature (35.5°C - 40.5°C)
            const baseTemp = 36.1 + Math.random() * 4.4;
            const temperature = Math.round(baseTemp * 10) / 10;
            
            // Hide scan line
            document.getElementById('scanLine').style.display = 'none';
            
            // Display result
            displayTemperature(temperature);
            
            // Add to measurements
            const now = new Date();
            measurements.push({
                temperature: temperature,
                timestamp: now.toLocaleString('id-ID'),
                status: getTemperatureStatus(temperature)
            });
            
            // Update displays
            updateStats();
            updateHistory();
            
            // Reset button
            setTimeout(() => {
                const measureBtn = document.getElementById('measureBtn');
                measureBtn.textContent = '📏 Mulai Pengukuran';
                measureBtn.disabled = false;
                measureBtn.className = 'bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg';
                isMessuring = false;
            }, 3000);
        }

        function displayTemperature(temperature) {
            const temperatureDisplay = document.getElementById('temperatureDisplay');
            const temperatureStatus = document.getElementById('temperatureStatus');
            const mercury = document.getElementById('mercury');
            
            // Animate temperature display
            temperatureDisplay.className = 'temperature-display text-white mb-2 bounce-in';
            temperatureDisplay.textContent = `${temperature}°C`;
            
            // Update status and color
            const status = getTemperatureStatus(temperature);
            temperatureStatus.textContent = status.text;
            
            // Update mercury height based on temperature (36°C = 20%, 40°C = 100%)
            const mercuryHeight = Math.max(0, Math.min(100, (temperature - 35) * 20));
            mercury.style.height = `${mercuryHeight}%`;
            
            // Update mercury color based on temperature
            if (temperature >= 39) {
                mercury.style.background = 'linear-gradient(to top, #dc2626, #b91c1c)';
            } else if (temperature >= 38.1) {
                mercury.style.background = 'linear-gradient(to top, #ef4444, #dc2626)';
            } else if (temperature >= 37.3) {
                mercury.style.background = 'linear-gradient(to top, #f97316, #ea580c)';
            } else {
                mercury.style.background = 'linear-gradient(to top, #10b981, #059669)';
            }
            
            // Show notification
            showNotification(temperature, status);
        }

        function getTemperatureStatus(temperature) {
            if (temperature < 36.1) {
                return { text: 'Suhu Tubuh Rendah', color: 'text-blue-400', bg: 'status-normal' };
            } else if (temperature <= 37.2) {
                return { text: 'Suhu Tubuh Normal', color: 'text-green-400', bg: 'status-normal' };
            } else if (temperature <= 38.0) {
                return { text: 'Demam Ringan', color: 'text-yellow-400', bg: 'status-fever' };
            } else if (temperature <= 39.0) {
                return { text: 'Demam', color: 'text-orange-400', bg: 'status-fever' };
            } else {
                return { text: 'Demam Tinggi', color: 'text-red-400', bg: 'status-high-fever' };
            }
        }

        function updateStats() {
            document.getElementById('measurementCount').textContent = measurements.length;
            
            if (measurements.length > 0) {
                const average = measurements.reduce((sum, m) => sum + m.temperature, 0) / measurements.length;
                document.getElementById('averageTemp').textContent = `${Math.round(average * 10) / 10}°C`;
                document.getElementById('lastTemp').textContent = `${measurements[measurements.length - 1].temperature}°C`;
            }
        }

        function updateHistory() {
            const historyList = document.getElementById('historyList');
            
            if (measurements.length === 0) {
                historyList.innerHTML = `
                    <div class="text-center text-white/50 py-8">
                        <div class="text-4xl mb-4">📋</div>
                        <p>Belum ada riwayat pengukuran</p>
                        <p class="text-sm mt-2">Mulai pengukuran untuk melihat riwayat</p>
                    </div>
                `;
                return;
            }
            
            historyList.innerHTML = measurements.slice(-10).reverse().map((measurement, index) => `
                <div class="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <div class="flex items-center space-x-4">
                        <div class="w-3 h-3 rounded-full ${getStatusColor(measurement.temperature)}"></div>
                        <div>
                            <div class="text-white font-semibold">${measurement.temperature}°C</div>
                            <div class="text-white/60 text-sm">${measurement.status.text}</div>
                        </div>
                    </div>
                    <div class="text-white/60 text-sm">${measurement.timestamp}</div>
                </div>
            `).join('');
        }

        function getStatusColor(temperature) {
            if (temperature < 36.1) return 'bg-blue-400';
            else if (temperature <= 37.2) return 'bg-green-400';
            else if (temperature <= 38.0) return 'bg-yellow-400';
            else if (temperature <= 39.0) return 'bg-orange-400';
            else return 'bg-red-400';
        }

        function clearHistory() {
            if (measurements.length === 0) return;
            
            if (confirm('Apakah Anda yakin ingin menghapus semua riwayat pengukuran?')) {
                measurements = [];
                updateStats();
                updateHistory();
                
                // Reset stats display
                document.getElementById('measurementCount').textContent = '0';
                document.getElementById('averageTemp').textContent = '--.-°C';
                document.getElementById('lastTemp').textContent = '--.-°C';
                
                showToast('Riwayat pengukuran berhasil dihapus');
            }
        }

        function showNotification(temperature, status) {
            // Create notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 glass-effect rounded-lg p-4 text-white shadow-lg z-50 transform translate-x-full transition-transform duration-300 max-w-sm';
            
            let icon = '🌡️';
            if (temperature >= 39) icon = '🔥';
            else if (temperature >= 38.1) icon = '🌡️';
            else if (temperature >= 37.3) icon = '⚠️';
            else icon = '✅';
            
            notification.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="text-2xl">${icon}</div>
                    <div>
                        <div class="font-semibold">${temperature}°C</div>
                        <div class="text-sm text-white/80">${status.text}</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
            }, 100);
            
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 4000);
        }

        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg z-50 transform translate-y-full transition-transform duration-300';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.remove('translate-y-full');
            }, 100);

            setTimeout(() => {
                toast.classList.add('translate-y-full');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateStats();
            updateHistory();
        });
 