# loader.js
Basic template view loader for ajax-heavy based web apps

simply create three files (controller, models & views), and use loader.loadPage("page-name-without-extension").after(()=>{}). This will load the appropriate html files from your views folder and run the callback you provide once loaded.
