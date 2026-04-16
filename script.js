function navTo(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.getElementById(pageId).classList.add('active-page');
    document.querySelectorAll('nav i').forEach(i => i.classList.remove('active'));
    element.classList.add('active');
}

async function startCamera() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    document.getElementById('status').innerText = "AI BOOTING...";
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
        const net = await posenet.load();
        document.getElementById('status').innerText = "TRACKING LIVE";

        function detect() {
            net.estimateSinglePose(video).then(pose => {
                ctx.clearRect(0,0,canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                pose.keypoints.forEach(kp => {
                    if(kp.score > 0.5) {
                        ctx.fillStyle = "#00ff88";
                        ctx.beginPath();
                        ctx.arc(kp.position.x, kp.position.y, 5, 0, 2*Math.PI);
                        ctx.fill();
                    }
                });
                requestAnimationFrame(detect);
            });
        }
        detect();
    } catch(e) {
        alert("Camera error: Please use HTTPS.");
    }
}
