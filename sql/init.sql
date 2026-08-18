CREATE TABLE IF NOT EXISTS public."Todos" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Description" VARCHAR(1000),
    "IsComplete" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public."Todos" ("Title", "Description", "IsComplete")
VALUES
  ('Set up EC2 deployment', 'Deploy the full-stack app on AWS EC2.', FALSE),
  ('Verify API health', 'Use Swagger to confirm the API is responding correctly.', TRUE)
ON CONFLICT DO NOTHING;
