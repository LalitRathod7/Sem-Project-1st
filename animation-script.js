// Animation sequence timing for critical-path testing scenes
const scenes = [
    { id: 'city-scene', duration: 5000 },          // Scene 1 - Opening
    { id: 'interface-transition', duration: 4000 }, // Scene 2 - System Introduction
    { id: 'login-scene', duration: 4000 },         // Scene 3 - Login Interface
    { id: 'dashboard-scene', duration: 4000 },     // Scene 4 - Dashboard Overview
    { id: 'map-scene', duration: 5000 },           // Scene 5 - Emergency Alert Flow
    { id: 'progress-scene', duration: 4000 },      // Scene 6 - Transfusion Process
    { id: 'ending-scene', duration: 5000 }         // Scene 7 - Ending Scene
];

let currentSceneIndex = 0;

function showScene(index) {
    // Hide all scenes
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });

    // Show current scene
    const currentScene = document.getElementById(scenes[index].id);
    if (currentScene) {
        currentScene.classList.add('active');
    }
}

function nextScene() {
    currentSceneIndex++;
    if (currentSceneIndex < scenes.length) {
        showScene(currentSceneIndex);
        setTimeout(nextScene, scenes[currentSceneIndex].duration);
    } else {
        // Animation complete, redirect to main site or loop
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

function startAnimation() {
    showScene(0);
    setTimeout(nextScene, scenes[0].duration);
}

// Add click to skip functionality
document.addEventListener('click', () => {
    if (currentSceneIndex < scenes.length - 1) {
        nextScene();
    }
});

// Add keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (currentSceneIndex < scenes.length - 1) {
            nextScene();
        }
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentSceneIndex > 0) {
            currentSceneIndex -= 2; // Go back one, but will increment in nextScene
            nextScene();
        }
    }
});

// Start animation when page loads
window.addEventListener('load', startAnimation);

// Sound effects for critical scenes
function playSoundEffect(effect) {
    // Placeholder for sound effects
    console.log(`Playing sound effect: ${effect}`);
}

// Trigger sound effects at appropriate times for critical-path scenes
setTimeout(() => playSoundEffect('dramatic'), 1000);  // Scene 1 dramatic sound
setTimeout(() => playSoundEffect('ui-intro'), 6000);  // Scene 2 UI intro sound
setTimeout(() => playSoundEffect('alert'), 19000);    // Scene 5 alert sound
setTimeout(() => playSoundEffect('success'), 24000);  // Scene 7 success sound
