async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'What is SFJ reflux and how does standing duplex ultrasound detect it?' })
    });
    const data = await res.json();
    console.log('Assistant Chat Status:', res.status);
    console.log('Answer Source:', data.source);
    console.log('Urgency Level:', data.urgencyLevel);
    console.log('Suggested Diagnostic:', data.suggestedDiagnostic);
    console.log('Questions count:', data.suggestedQuestions?.length);
  } catch (e) {
    console.error('Error in test:', e);
  }
}

test();
