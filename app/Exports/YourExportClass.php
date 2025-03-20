<?php

namespace App\Exports;

use App\Models\FileLog;
use App\Models\YourModel;
use Maatwebsite\Excel\Concerns\FromCollection;

class YourExportClass implements FromCollection
{
    public function collection()
    {
        return FileLog::all();
    }
}

