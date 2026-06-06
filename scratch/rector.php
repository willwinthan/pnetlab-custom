<?php

use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\SetList;
use Rector\Set\ValueObject\LevelSetList;

return static function (RectorConfig $rectorConfig): void {
    // Specify the paths to scan (legacy PHP backend files)
    $rectorConfig->paths([
        __DIR__ . '/../html/includes',
        __DIR__ . '/../html/api.php',
    ]);

    // Exclude third party libraries if any (e.g., Slim framework)
    $rectorConfig->skip([
        __DIR__ . '/../html/includes/Slim',
        __DIR__ . '/../html/includes/Slim-Extras',
        __DIR__ . '/../html/includes/Parsedown.php',
    ]);

    // Define rules for PHP 8.3 compatibility
    $rectorConfig->sets([
        LevelSetList::UP_TO_PHP_83,
        SetList::CODE_QUALITY,
        SetList::DEAD_CODE,
    ]);

    // Enable automatic binding of dynamic properties (deprecated in PHP 8.2+)
    // This allows PHP classes to declare properties dynamically to prevent fatal deprecations.
    // $rectorConfig->rule(\Rector\Php82\Rector\Class_\ReadOnlyClassRector::class);
};
