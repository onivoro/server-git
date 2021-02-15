import { Injectable } from '@nestjs/common/';
import { execPromise } from '@onivoro/server-process';
@Injectable()
export class GrepService {

    grepForLinesMatching(query: string, cwd: string, pathFilter='') {
        const pathFilterExpression = pathFilter ? `-- ${pathFilter}` : '';
        return execPromise(`cd ${cwd} && git grep --line-number -n -F ${query} ${pathFilterExpression}`)
            .then(r => r.split('\n').filter(l => !!l))
    }
}
