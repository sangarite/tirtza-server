const addEvent = (connection, sql) => (req, res) => {
    const { name, group,date } = req.body;
    connection.connect()
    .then(() => {
        const request = new sql.Request(connection);
        request.query(`INSERT INTO Events (GroupId, EventName,EventDate) VALUES (${group},N'${name}',${date})`)
        .then(result => { 
            console.log('event inserted')
            res.send('event inserted');
            connection.close();
        })
        .catch(err => {
            console.log(err, 'could not insert event');
            connection.close();
        })
    })
    .catch(err => console.log('could not connect to the server'))
}

const RemoveEvent = (connection, sql) => (req, res) => {
    const { eventId } = req.body;
    connection.connect()
    .then(() => {
        const request = new sql.Request(connection);
        request.query(`DELETE FROM Events WHERE EventId=${req.body.group}`)
        .then(result => { 
            res.send('event remove');
            connection.close();
        })
        .catch(err => {
            console.log(err, 'could not remove event');
            connection.close();
        })
    })
    .catch(err => console.log('could not connect to the server'))
}

const UpdateEvent= (connection, sql) => (req, res) => {
    const { date } = req.body;
    connection.connect()
    .then(() => {
        const request = new sql.Request(connection);
        request.query(`UPDATE Events SET EventDate = ${date} WHERE groupId=${req.body.group}`)
        .then(result => { 
            res.send('event update');
            connection.close();
        })
        .catch(err => {
            console.log(err, 'could not update event');
            connection.close();
        })
    })
    .catch(err => console.log('could not connect to the server'))
}


const getEvent = (connection, sql) => (req, res) => {
    const group = req.params.group;
    connection.connect()
    .then(() => {
        const request = new sql.Request(connection);
        request.query(`SELECT * FROM Events WHERE GroupId=${group}`)
        .then(result => {
            console.log(result.recordset)
            res.send(result.recordset);
            connection.close();
        })
        .catch(err => {
            console.log('could not find events');
            connection.close();
        })
    })
    .catch(err => console.log('could not connecto to the server'))
}

module.exports = { 
    addEvent: addEvent,
    getEvent: getEvent,
    RemoveEvent:RemoveEvent,
    UpdateEvent:UpdateEvent
};