import { Ratelimit }
  from '@upstash/ratelimit'

import { Redis }
  from '@upstash/redis'

const redis = new Redis({

  url:
    process.env.UPSTASH_REDIS_REST_URL,

  token:
    process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const paymentRateLimit =
  new Ratelimit({

    redis,

    limiter:
      Ratelimit.slidingWindow(
        5,
        '1 m'
      ),
})

export const redeemRateLimit =
  new Ratelimit({

    redis,

    limiter:
      Ratelimit.slidingWindow(
        10,
        '1 m'
      ),
})