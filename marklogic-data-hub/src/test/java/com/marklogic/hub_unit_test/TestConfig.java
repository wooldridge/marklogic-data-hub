package com.marklogic.hub_unit_test;

import com.marklogic.client.ext.DatabaseClientConfig;
import com.marklogic.client.ext.helper.DatabaseClientProvider;
import com.marklogic.client.ext.spring.SimpleDatabaseClientProvider;
import com.marklogic.hub.LoadTestModules;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

/**
 * Spring configuration class that defines a connection to the final REST server in the test project.
 *
 * This isn't in the "com.marklogic.hub" package so that it's not picked up by Spring ComponentScan annotations that
 * scan that package.
 */
@Configuration
@PropertySource(
    value = {"file:gradle.properties", "file:gradle-local.properties"},
    ignoreResourceNotFound = true
)
public class TestConfig implements InitializingBean {

    @Value("${mlUsername}")
    private String username;

    @Value("${mlPassword}")
    private String password;

    @Value("${mlHost:localhost}")
    private String host;

    @Value("${mlFinalPort:8011}")
    private Integer finalPort;

    @Value("${mlModulesDbName}")
    private String modulesDatabaseName;

    @Value("${mlModulePermissions}")
    private String modulePermissions;

    /**
     * This is needed because other tests in the DHF test suite will clear "user" modules, thus deleting the
     * marklogic-unit-test and test modules.
     */
    public void loadTestModules() {
        LoadTestModules.loadTestModules(host, finalPort, username, password, modulesDatabaseName, modulePermissions);
    }

    /**
     * Has to be static so that Spring instantiates it first.
     */
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyConfigurer() {
        PropertySourcesPlaceholderConfigurer c = new PropertySourcesPlaceholderConfigurer();
        c.setIgnoreResourceNotFound(true);
        return c;
    }

    /**
     * AbstractSpringMarkLogicTest depends on an instance of DatabaseClientProvider.
     *
     * @return
     */
    @Bean
    public DatabaseClientProvider databaseClientProvider() {
        return new SimpleDatabaseClientProvider(
            new DatabaseClientConfig(host, finalPort, username, password)
        );
    }

    /**
     * Invoked by the containing {@code BeanFactory} after it has set all bean properties
     * and satisfied {@link BeanFactoryAware}, {@code ApplicationContextAware} etc.
     * <p>This method allows the bean instance to perform validation of its overall
     * configuration and final initialization when all bean properties have been set.
     *
     * @throws Exception in the event of misconfiguration (such as failure to set an
     *                   essential property) or if initialization fails for any other reason
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        loadTestModules();
    }
}
