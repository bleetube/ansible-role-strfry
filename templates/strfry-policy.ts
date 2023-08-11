#!/bin/sh
//bin/true; exec deno run "$0" "$@"
import {
    antiDuplicationPolicy,
    hellthreadPolicy,
    pipeline,
    rateLimitPolicy,
    readStdin,
    writeStdout,
  } from 'https://gitlab.com/soapbox-pub/strfry-policies/-/raw/v0.1.0/mod.ts';
  
  for await (const msg of readStdin()) {
    const result = await pipeline(msg, [
      [hellthreadPolicy, { limit: 100 }],
      [antiDuplicationPolicy, { ttl: 60000, minLength: 50 }],
      [rateLimitPolicy, { whitelist: ['127.0.0.1'] }],
    ]);
  
    writeStdout(result);
  }
  