export default async (request: Request) => {
  console.log('Curve Viewer Edge Function - Starting');
  
  // Always return iframe HTML to bypass all authentication issues
  const iframeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revenue Forecasts - GridStor Analytics</title>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        iframe { width: 100%; height: 100vh; border: none; }
        .loading { 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            font-family: Arial, sans-serif;
            color: #666;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="loading">Loading Revenue Forecasts...</div>
    <iframe src="https://gridstor.netlify.app/curve-viewer/" 
            onload="document.querySelector('.loading').style.display='none'"
            title="Revenue Forecasts"></iframe>
</body>
</html>`;

  console.log('Curve Viewer Edge Function - Returning iframe HTML');
  
  return new Response(iframeHTML, {
    status: 200,
    headers: {
      'content-type': 'text/html',
      'cache-control': 'no-cache'
    }
  });
};

export const config = {
  path: ["/curve-viewer", "/curve-viewer/*"],
};