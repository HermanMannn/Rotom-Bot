const { SlashCommandBuilder , EmbedBuilder} = require('discord.js');
const { google } = require('googleapis');


const GOOGLE_API_KEY = '///'; 

const YOUR_CLIENT_ID = '///';
const YOUR_CLIENT_SECRET = '///';
const YOUR_REDIRECT_URL ='http://localhost:3000/oauth2callback';
const YOUR_REFRESH_TOKEN = '///';

const oauth2Client = new google.auth.OAuth2(
    YOUR_CLIENT_ID,
    YOUR_CLIENT_SECRET,
    YOUR_REDIRECT_URL
  );

  oauth2Client.setCredentials({ refresh_token: YOUR_REFRESH_TOKEN });
//const sheets = google.sheets({ version: 'v4', auth: GOOGLE_API_KEY });
const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
module.exports = {
	data: new SlashCommandBuilder()
		.setName('check')
		.setDescription('Check if Pokemon is taken'),
            
            
	async execute(interaction) {

       /* exec('node draft.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing file: ${error}`);
                return message.reply('There was an error executing the file.');
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return message.reply('There was an error with the output.');
            }
            message.reply(`Output: ${stdout}`);
            


       }); //you left for chemisty lab, make the embed command in the 'idkkk' file instead of here.*/


       let strikethroughStatusString = '';
       
// Check if cell is bold
async function areTextsStrikethrough(spreadsheetId, sheetName, range) {
    try {
      const response = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
        ranges: [`${sheetName}!${range}`], // Use the specified range
        includeGridData: true,
      });
  
      const results = {};
  
      response.data.sheets.forEach(sheet => {
        const gridData = sheet.data[0];
  
        gridData.rowData.forEach((row, rowIndex) => {
          row.values.forEach((cellData, colIndex) => {
            const cellReference = `${sheetName}!${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
  
            if (cellData.userEnteredFormat &&
                cellData.userEnteredFormat.textFormat &&
                cellData.userEnteredFormat.textFormat.strikethrough) {
              results[cellReference] = true;
            } else if (cellData.textFormatRuns) {
              for (const run of cellData.textFormatRuns) {
                if (run.textFormat && run.textFormat.strikethrough) {
                  results[cellReference] = true;
                  break;
                }
              }
              results[cellReference] = results[cellReference] || false; // If no strikethrough found, mark as false
            } else {
              results[cellReference] = false; // No formatting
            }
          });
        });
      });

      const data = response.data.values;
      strikethroughStatusString = Object.entries(results)
      .map(([cell, isStrikethrough, row]) => `${cell}: ${isStrikethrough} `)
      .join(', \n');

      
			//const formattedData = data.map(row => row.join(', ')).join('\n');	

      
     
			//strikethroughStatusString = data.map(row => row.join(isStrikethrough, ', ')).join('\n');	
      const embed = new EmbedBuilder()
      .setTitle("Draft Board")
      .setDescription("Are the mons available")
      .setColor("Green")
      .addFields({
            name: 'Mons',
            value : strikethroughStatusString
       });
      
    
      await interaction.reply({embeds: [embed]});


      return results; 

      
    } catch (error) {
      console.error('Error retrieving cell formatting:', error);
      throw error;
    }}
    // Example usage
    const spreadsheetId = '1eNzHZJ2T22pEJk1ltO_hF6kzay2Gydrz_mVoG3ZLD8A';
    const sheetName = 'Draft Board'; 
    const range = 'D5:G14'; 
    /*
    areTextsStrikethrough(spreadsheetId, sheetName, range).then(results => {
      console.log('Strikethrough Status:', results);
    }).catch(console.error);


    const go = areTextsStrikethrough(spreadsheetId, sheetName, range).then(results => {
      console.log('Strikethrough Status:', strikethroughStatusString);})
    */
    areTextsStrikethrough(spreadsheetId, sheetName, range).then(results => {
      console.log('Strikethrough Status:', strikethroughStatusString);
    }).catch(console.error);


 } 
}
