import { createLog } from '../controllers/logs.controller.js';

const registrarLog = async (idLog, accion, userName, userAgent, ip) => {
    const req = {
        body: {
            idLog: idLog,
            accion: accion,
            userName: userName,
            userAgent: userAgent,
            ip: ip
        }
    }

    const res = {
        status: (code) => (
            {
                json: (data) => {
                    console.log(data);
                }
            }
        )
    }

    await createLog(req, res);
};

export { registrarLog };