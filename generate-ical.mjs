async function readDaysJson() {
    console.log('Reading days.json...');
    try {
        const fileContents = await fs.readFile('./days.json', 'utf-8');
        console.log('File contents:', fileContents);
        
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Failed to read days.json:', error);
        return [];
    }
}