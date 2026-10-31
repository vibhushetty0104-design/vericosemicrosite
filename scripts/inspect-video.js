async page => {
  await page.setContent(`
    <html>
      <body style="margin:0; background:#0B4036; display:flex; align-items:center; justify-content:center; height:100vh;">
        <video id="vid" src="/videos/vein-flowing.mp4" muted autoplay playsinline style="max-width:100%; max-height:100%;"></video>
      </body>
    </html>
  `);
  await page.goto('http://localhost:5173/videos/vein-flowing.mp4');
  await page.waitForTimeout(1000);
  const videoDetails = await page.evaluate(() => {
    const v = document.querySelector('video');
    return v ? {
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      duration: v.duration,
      paused: v.paused,
      muted: v.muted
    } : null;
  });
  console.log('VIDEO_DETAILS:', JSON.stringify(videoDetails));
  
  // Capture a poster image
  await page.screenshot({ path: 'public/videos/vein-flowing-poster.jpg' });
  return videoDetails;
}
