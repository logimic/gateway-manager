@echo off
CD ./oegw-things-schemas
for %%a in (*.json) do (
json2ts %%a >> ..\oegw-things.d.ts
)