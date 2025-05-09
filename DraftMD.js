const { SlashCommandBuilder} = require('discord.js');
const { google } = require('googleapis');
const SPREADSHEET_ID = '1qBvxJkmBdfv2CrPvOqXKpWF0RU-RuL-WenpcbCVDBhc'; //real
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
const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

///////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mmddraft')
        .setDescription('Draft mon into your team')
        .addStringOption(option =>
            option.setName('team')
            .setDescription('Choose your respective team')
            .setRequired(true)
            .addChoices(
                { name: 'Team 1', value: '1' },
                { name: 'Team 2', value: '2' },
                { name: 'Team 3', value: '3' },
                { name: 'Team 4', value: '4' },
                { name: 'Team 5', value: '5' },
                { name: 'Team 6', value: '6' },
                { name: 'Team 7', value: '7' },
                { name: 'Team 8', value: '8' },
                { name: 'Team 9', value: '9' },
                { name: 'Team 10', value: '10' },
                { name: 'Team 11', value: '11' },
                { name: 'Team 12', value: '12' },
                        )
            )

        .addStringOption(option => 
            option.setName('values')
                .setDescription('Draft your Pokemon')
                .setRequired(true)),

///////////////////////////////////////////////////////////////////////////////////////////////
            
    async execute(interaction) {
        await interaction.deferReply();
                    
        const teamColumns = {
            '1': 'H',
            '2': 'S',
            '3': 'AD',
            '4': 'AO',
            '5': 'AZ',
            '6': 'BK',
            '7': 'H',
            '8': 'S',
            '9': 'AD',
            '10': 'AO',
            '11': 'BZ',
            '12': 'BK'
        };
        const teamValue = interaction.options.getString('team');
        let x, startRow, endRow, column;
        if (teamColumns[teamValue]) {
            column = teamColumns[teamValue];
            startRow = teamValue <= 6 ? 6 : 27;
            endRow = teamValue <= 6 ? 17 : 38;
            x = `Draft Teams!${column}${startRow}:${column}${endRow}`;
        } else {
            console.log("Invalid team selection!");
        }
       // Get cell
        const valuesInput = interaction.options.getString('values'); // Get user input
        const valuesArray = valuesInput.split(',').map(value => [value]); // Parse values

        const pointcol = {
            '1': 'I',
            '2': 'T',
            '3': 'AE',
            '4': 'AP',
            '5': 'BA',
            '6': 'BL',
            '7': 'I',
            '8': 'T',
            '9': 'AE',
            '10': 'AP',
            '11': 'BA',
            '12': 'BL'
        }
        let y='';
        if (pointcol[teamValue]) {
            const colum = pointcol[teamValue];
            startrow = teamValue <= 6 ? 18 : 39;
            y = `Draft Teams!${colum}${startrow}`;
        } else {
            console.log("Invalid team selection!");
        }
        
        const responses = await Promise.all([
            sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: x }),
            sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: y })
        ]);

        let points;

        const values = responses[0].data.values;
        console.log("Mons found in the draft: " + values);
        points       = responses[1].data.values;
        console.log("Points read in the beginning: " + points);


        if(points > 0){
                for (let i = 0; i < 11; i++) {

                    if(values == undefined || values[i] == undefined){
                        x = `Draft Teams!${column}${startRow+i}`;
                        console.log("It was undefined")
                        break;
                        
                    }
                    else{
                        console.log("Continued")
                        continue;
                    }
                }
            
            console.log(`Drafting to ${x}`);
            
            await interaction.editReply("Team found..."); 
            try {
                // Update cell
                await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: x, 
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: valuesArray, 
                    }
                });

                const response = await sheets.spreadsheets.values.get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: y, 
                });

                points = response.data.values;
                
                points < 0 ? points = points + " contact mod!!!" : points

                await interaction.editReply(`Successfully drafted "${valuesInput}" to Team ${teamValue} you have ${points} points left`);
                console.log(`Log: Successfully drafted "${valuesInput}" to Team ${teamValue} you have ${points} points left`);
            } catch (error) {
                console.error('Error updating Google Sheets:', error);
                await interaction.editReply('There was an error updating the Google Sheet.');
            }
        }
        else{
            await interaction.editReply('Your team does not have enough points to draft.');
        }

    }
};