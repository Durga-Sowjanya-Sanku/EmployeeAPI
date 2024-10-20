const http = require('http');

// Mimic database
const employees = [
    { id: 1, name: 'Sowjanya' },
    { id: 2, name: 'John' },
    { id: 3, name: 'Ash' }
];

const requesthandler = (request, response) => {
    const { method, url } = request;
    const parts = url.split('/');
    const emp_id = parts[2]; 

    console.log(parts);

    if (method === "GET" && url === '/employees') {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(employees));
    } 
    
    else if (method === "GET" && parts[1] === "employees" && emp_id) {
        const employee = employees.find(obj => obj.id == emp_id); 

        if (employee) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(employee));
        } else {
            response.writeHead(404, { "Content-Type": "text/plain" }); 
            response.end("Employee not found");
        }
    } 
    
    else if (method === "POST" && url === '/employees') {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk;
        });

        request.on('end', () => {
            const newEmp = JSON.parse(body);
            
            newEmp.id = employees.length ? employees[employees.length - 1].id + 1 : 1; 
            employees.push(newEmp);
            
            response.writeHead(201, { "Content-Type": "application/json" });
            response.end(JSON.stringify(newEmp));
        });
    } 
  
    else {
        response.writeHead(404, { "Content-Type": "text/plain" }); 
        response.end("Not Found");
    }
};

// Create server
const server = http.createServer(requesthandler);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});
