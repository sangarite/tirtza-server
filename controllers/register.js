const handleRegister = (connection, sql, bcrypt) => (req, res) => {

    const { firstName, lastName, id, birthday, email, password, groupName, groupId } = req.body;

    console.log(req.body)
    //check that the id is uniqe

    if (groupName) {
        connection.connect()
        .then(() => {
            const request = new sql.Request(connection);
            request.query(`INSERT INTO [dbo].[Group] (GroupName) OUTPUT INSERTED.* VALUES ('${groupName}')`)
            .then((result) => {
                connection.close();
                groupId = result.recordset.GroupId;
            })
            .catch(err => {
                console.log('could not insert new group');
                connection.close();
            })
        })
        .catch(err => console.log('could not connect to the database (from register)'))
    }

    connection.connect()
    .then(() => {
        const request = new sql.Request(connection);
        request.query(`SELECT * FROM Users WHERE UserId='${id}'`)
        .then((result) => {
            connection.close();
            if(result.recordset.length === 0) {
                connection.connect()
                .then(() => {
                    const request = new sql.Request(connection);
                    const hash = bcrypt.hashSync(password, 10);
                    request.query(`INSERT INTO Users (UserId, Password, LastName, FirstName, Email, BirthDate, GroupId) OUTPUT INSERTED.* VALUES ('${id}', '${hash}', N'${lastName}', N'${firstName}', '${email}', '${birthday}', ${groupId})`)
                    .then((result) => { 
                        res.send('המשתמש נוסף');
                        console.log('inserted user')
                        connection.close();
                    })
                    .catch((err) => {
                        console.log(err)
                        res.send(err + 'error inserting user');
                        connection.close();
                    })
        
                })
                .catch((err) => console.log(err + 'error connecting to database'))
            } else {
                res.send('תעודת זהות קיימת');
            }
        })
        .catch(err => {
            console.log('could not access the users table');
            connection.close();
        })
    })
    .catch(err => console.log('could not connect to the server'))
}
  
  module.exports = { handleRegister: handleRegister };