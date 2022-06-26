import { Injectable } from '@nestjs/common/';
import { execPromise, spawnPromise } from '@onivoro/server-process';

@Injectable()
export class GrepService {

    grepForLinesMatching(query: string, cwd: string, pathFilter = '') {
        const pathFilterExpression = pathFilter ? `-- ${pathFilter}` : '';
        // change this to use spawn with args array as done in onx-fnr and then invoke this logic in that project
        return execPromise(`cd ${cwd} && git grep --line-number -n -F ${query} ${pathFilterExpression}`)
            .then(r => r.split('\n').filter(l => !!l))
    }

    async grep(find: string, cwd: string, _: string[] = [], flagObject: {w?: boolean, i?: boolean, n?: boolean, v?: boolean }= {w: false, i: false, n: false, v: false}, nameOnly = true) {        
        const flagKeys = Object.keys(flagObject);
        const fs = flagKeys
            .filter(flagKey => flagObject[flagKey])

        const flags = fs.length ? ` -${fs.join(' -')}` : '';

        let findFilesCmd = `grep ${nameOnly ? '--name-only ' : ''}${flags} -F`;

        const args = [...findFilesCmd.split(' '), this.sanitize(find), '--', ...(_ || [])].filter(Boolean);

        try {
            const stdout = await spawnPromise('git', args, { encoding: 'utf-8', cwd });
            const files = stdout
                .toString().split('\n').filter(f => f && f.trim().length);

            return files;
        } catch (stderr) {
            console.error(stderr);
            throw stderr;
        }
    }

    private sanitize(payload: string): string {
        return payload
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
      }
}
